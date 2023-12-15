# diagnosis/urls.py
from django.urls import path
from .views import index, selecionar_sintomas

urlpatterns = [
    path('', index, name='index'),
    path('selecionar_sintomas/', selecionar_sintomas, name='selecionar_sintomas'),
]
