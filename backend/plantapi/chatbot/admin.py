from django.contrib import admin

# Register your models here.
from .models import ChatBotResponse

@admin.register(ChatBotResponse)
class ChatBotResponseAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'question', 'answer', 'created_at')