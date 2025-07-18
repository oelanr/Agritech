from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
import requests
from .models import ChatBotResponse
from .serializers import ChatResponseSerializer


# Chat Predict View
class ChatPredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):        
        # url = 'http://localhost:8000/predict_and_chat'
        url = 'http://127.0.0.1:8000/predict_and_chat'
        input_data = request.data.get("input")

        try:
            response = requests.post(url, json=input_data)
            response.raise_for_status()
            data = response.json()
            return Response(data, status=200)
        except User.DoesNotExist:
            return Response({"error": "Problème Serveur sur l'appel de l'API prédiction"}, status=404)
        

# ChatBot View
class ChatBotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")
        question = request.data.get("question")

        if not session_id or not question:
            return Response({"error": "utilisateur et question requis"}, status=400)
        
        url = 'http://localhost:8000/chat'
        try:
            response = requests.post(url, json=request.data)
            response.raise_for_status()
            data = response.json()

            # Save the response to the database
            ChatBotResponse.objects.create(
                session_id=session_id,
                question=question,
                answer=data.get("answer", "")
            )

            return Response(data, status=200)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=500)
        


class ChatBotResponseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        session_id = request.query_params.get("session_id")
        if session_id:
            responses = ChatBotResponse.objects.filter(session_id=session_id)
        else:
            responses = ChatBotResponse.objects.all()
        
        serializer = ChatResponseSerializer(responses, many=True)
        return Response(serializer.data)