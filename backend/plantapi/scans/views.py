# scans/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json

# L'URL de votre API FastAPI.
# Assurez-vous que le port est le bon (souvent 8000 si vous avez lancé Django sur un autre port)
# ou l'URL du serveur si c'est sur une machine différente.
FASTAPI_API_URL = 'http://192.168.88.251:8000/chat/'

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import HistoriqueScan
from rest_framework import status
from .serializers import HistoriqueScanSerializer

class HistoriqueScanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Liste tous les scans de l'utilisateur connecté"""
        historiques = HistoriqueScan.objects.filter(utilisateur=request.user).order_by('-date_scan')
        serializer = HistoriqueScanSerializer(historiques, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Sauvegarder un nouveau scan"""
        symptomes = request.data.get('symptomes')
        prediction = request.data.get('prediction')

        if not symptomes or not prediction:
            return Response({'error': 'Données incomplètes'}, status=400)

        historique = HistoriqueScan.objects.create(
            utilisateur=request.user,
            symptomes=symptomes,
            prediction=prediction
        )

        serializer = HistoriqueScanSerializer(historique)
        return Response(serializer.data, status=201)

class ClassificationView(APIView):
    def post(self, request, *args, **kwargs):
        """
        Gère les requêtes de classification de plantes.
        Cette vue doit être connectée à votre modèle de classification réel.
        """
        # Votre logique de classification ici...
        
        # Exemple de réponse
        return Response({"category": "GENERAL_QUERY"}, status=status.HTTP_200_OK)

class ChatbotView(APIView):
    def post(self, request, *args, **kwargs):
        """
        Agit comme un proxy, transférant la requête du client vers l'API FastAPI
        et renvoyant la réponse du chatbot.
        """
        # 1. Récupérer les données de la requête du client
        question = request.data.get('question')
        
        if not question:
            return Response(
                {"error": "Une question est requise."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 2. Préparer les données pour l'API FastAPI.
            # L'API FastAPI utilise un Pydantic BaseModel, qui nécessite une structure JSON spécifique.
            payload = {
                "question": question,
                "session_id": "default"  # Vous pouvez gérer les sessions ici si besoin
            }
            
            # 3. Envoyer la requête à l'API FastAPI
            response = requests.post(FASTAPI_API_URL, json=payload)
            response.raise_for_status() # Lève une exception pour les codes d'erreur HTTP
            
            # 4. Récupérer la réponse de l'API FastAPI et la renvoyer au client
            fastapi_response_data = response.json()
            
            # L'API FastAPI renvoie "answer", le client React Native attend "reply"
            # Il faut faire la correspondance
            bot_reply = fastapi_response_data.get("answer", "Désolé, je n'ai pas de réponse pour le moment.")
            
            return Response({"reply": bot_reply}, status=status.HTTP_200_OK)
        
        except requests.exceptions.RequestException as e:
            # Gérer les erreurs de connexion à l'API FastAPI
            print(f"Erreur de connexion à l'API FastAPI: {e}")
            return Response(
                {"error": "Impossible de joindre le service de chatbot."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except json.JSONDecodeError as e:
            # Gérer les erreurs de décodage JSON de la réponse de l'API FastAPI
            print(f"Erreur de décodage JSON de la réponse FastAPI: {e}")
            return Response(
                {"error": "Erreur de format de réponse du service de chatbot."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            # Gérer toute autre erreur inattendue
            print(f"Erreur inattendue dans ChatbotView: {e}")
            return Response(
                {"error": "Une erreur interne est survenue."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )