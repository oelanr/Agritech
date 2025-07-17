from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import HistoriqueScan
from .serializers import HistoriqueScanSerializer

class ListeHistoriqueScanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Liste tous les scans de l'utilisateur connecté"""
        historiques = HistoriqueScan.objects.filter(utilisateur=request.user).order_by('-date_scan')
        serializer = HistoriqueScanSerializer(historiques, many=True)
        return Response(serializer.data)

class NouveauScanView(APIView):
    permission_classes = [IsAuthenticated]

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
