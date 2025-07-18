from django.urls import path
from .views import HistoriqueScanView,ClassificationView,ChatbotView

urlpatterns = [
    path('historique/', HistoriqueScanView.as_view(), name='historique_scan'),
]
