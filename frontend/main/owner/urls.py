
from django.urls import path
from . import views

app_name = 'holder'
urlpatterns = [
    path('home/', views.menu, name='home'),
    path('datasets/', views.datasets, name='datasets'),
    path('register_datasets/', views.register_datasets, name='register_datasets'),
    path('schemas_owner/', views.schemas_owner, name='schemas_owner'),
    
]



