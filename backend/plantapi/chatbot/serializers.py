from rest_framework import serializers
from .models import ChatBotResponse

class ChatResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatBotResponse
        fields = ['session_id', 'question', 'answer', 'created_at']