from django.urls import path
from .views import ChatPredictView, ChatBotView
from .views import ChatBotResponseListView

urlpatterns = [
    path('chat-predict/', ChatPredictView.as_view()),
    path('chatbot/', ChatBotView.as_view()),
    path('responses/', ChatBotResponseListView.as_view())
]
