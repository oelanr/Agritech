import joblib
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import PlantDiagnosisInputSerializer

# chemin model
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))  # .../backend/plantapi/classifier
PROJECT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, '..', '..', '..'))  #  backend/plantapi/classifier → backend/plantapi → backend → Agritech
MODEL_PATH = os.path.join(PROJECT_DIR, 'ml', 'classification', 'models', 'modele_arbre.joblib')

model = joblib.load(MODEL_PATH)

encode = {
    "humidite": {"basse": 0, "moyenne": 1, "élevée": 2},
    "luminosite": {"faible": 0, "moyenne": 1, "forte": 2},
    "vent": {"faible": 0, "modéré": 1, "fort": 2},
    "stade_croissance": {"jeune": 0, "mature": 1, "floraison": 2},
    "type_sol": {"argileux": 0, "sableux": 1, "limoneux": 2},
    "irrigation": {"manuelle": 0, "automatique": 1, "aucune": 2}
}

class PlantDiseasePredictionView(APIView):
    def post(self, request):
        serializer = PlantDiagnosisInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            features = [
                int(data['taches']),
                int(data['feuille_jaune']),
                int(data['taches_circulaires']),
                int(data['bord_feuille_brun']),
                int(data['fletrissure']),
                int(data['presence_champignons']),
                encode["humidite"][data["humidite"]],
                encode["luminosite"][data["luminosite"]],
                encode["vent"][data["vent"]],
                int(data['pluie_recente']),
                encode["stade_croissance"][data["stade_croissance"]],
                int(data['fertilisation_recente']),
                encode["type_sol"][data["type_sol"]],
                encode["irrigation"][data["irrigation"]],
            ]
            prediction = model.predict([features])[0]
            return Response({'prediction': prediction})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
