# urls.py
from django.urls import path
from .views import ListeHistoriqueScanView, NouveauScanView

urlpatterns = [
    path('historique/', ListeHistoriqueScanView.as_view(), name='liste_historique'),
    path('savescan/', NouveauScanView.as_view(), name='nouveau_scan'),
]
