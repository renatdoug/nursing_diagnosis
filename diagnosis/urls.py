# diagnosis/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('fazer_previsao/', views.fazer_previsao, name='fazer_previsao'),
]
