from django.urls import path
from .views import HistoriqueScanView

urlpatterns = [
    path('historique/', HistoriqueScanView.as_view(), name='historique_scan'),
]
