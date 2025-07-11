from django.urls import path
from .views import PlantDiseasePredictionView

urlpatterns = [
    path('predict/', PlantDiseasePredictionView.as_view(), name='predict'),
]
