from django.shortcuts import render
import os
import joblib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import PlantInputSerializer

# model loading -- mbola miandry .pkl ### 
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'decision_tree_model.pkl')
model = joblib.load(MODEL_PATH)

humidity_mapping = {"élevé": 2, "moyen": 1, "faible": 0}

class PredictView(APIView):
    def post(self, request):
        serializer = PlantInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            humidity = humidity_mapping[data["humidity_level"]]
            yellow_leaves = int(data["isYellowLeaves"])
            features = [[humidity, yellow_leaves]]
            prediction = model.predict(features)[0]
            return Response({"prediction": prediction}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

