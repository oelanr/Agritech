from django.db import models
from django.contrib.auth.models import User

class HistoriqueScan(models.Model):
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE)
    date_scan = models.DateTimeField(auto_now_add=True)
    symptomes = models.JSONField()
    prediction = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.utilisateur.username} - {self.prediction} - {self.date_scan}"
