from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),  
    path('api/', include('scans.urls')),  
    path('api/', include('chatbot.urls')),  
]
