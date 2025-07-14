from rest_framework import serializers
from .models import HistoriqueScan

class HistoriqueScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueScan
        fields = ['id', 'date_scan', 'symptomes', 'prediction']
