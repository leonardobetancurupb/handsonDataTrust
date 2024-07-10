
from django.urls import path
from . import views

app_name = 'consumer'
urlpatterns = [
    path('info/', views.menu, name='info'),
    path('consumer_history/', views.consumer_history, name='consumer_history'),
    path('select_dataset/', views.select_dataset, name='select_dataset'),
    path('select_dataset_activated/', views.select_dataset_activated, name='select_dataset_activated'),
    path('view_datasets/', views.view_dataset, name='view_datasets'),
    
]



