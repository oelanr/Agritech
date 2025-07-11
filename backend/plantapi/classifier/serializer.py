from rest_framework import serializers

class PlantInputSerializer(serializers.Serializer):
    humidity_level = serializers.ChoiceField(choices=["élevé", "moyen", "faible"])
    isYellowLeaves = serializers.BooleanField()
