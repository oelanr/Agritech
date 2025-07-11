from rest_framework import serializers

class PlantDiagnosisInputSerializer(serializers.Serializer):
    taches = serializers.BooleanField()
    feuille_jaune = serializers.BooleanField()
    taches_circulaires = serializers.BooleanField()
    bord_feuille_brun = serializers.BooleanField()
    fletrissure = serializers.BooleanField()
    presence_champignons = serializers.BooleanField()
    humidite = serializers.ChoiceField(choices=["basse", "moyenne", "élevée"])
    luminosite = serializers.ChoiceField(choices=["faible", "moyenne", "forte"])
    vent = serializers.ChoiceField(choices=["faible", "modéré", "fort"])
    pluie_recente = serializers.BooleanField()
    stade_croissance = serializers.ChoiceField(choices=["jeune", "mature", "floraison"])
    fertilisation_recente = serializers.BooleanField()
    type_sol = serializers.ChoiceField(choices=["argileux", "sableux", "limoneux"])
    irrigation = serializers.ChoiceField(choices=["manuelle", "automatique", "aucune"])
