from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  
    path('api/cotacoes/', views.api_cotacoes, name='api_cotacoes'),
    path("api/cotacoes/salvas/", views.api_cotacoes_salvas, name="api_cotacoes_salvas"),
]
