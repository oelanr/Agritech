from django.db import models

# Create your models here.
from django.db import models

class ChatBotResponse(models.Model):
    session_id = models.CharField(max_length=255)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session: {self.session_id} | Question: {self.question[:50]}"