from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from .serializers import UserSerializer

# Register
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Nom d'utilisateur et mot de passe requis"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Cet utilisateur existe déja"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=201)

# Login
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Mot de passe ou username incorrect"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})

# Protected view example
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        user_data = serializer.data
        
        initial = user.username[0].upper() if user.username else ''
        
        user_data['initial'] = initial
        
        return Response(user_data)

