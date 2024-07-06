
from django.urls import path
from . import views

app_name = 'consumer'
urlpatterns = [
    path('info/', views.menu, name='info'),
    path('consumer_history/', views.consumer_history, name='consumer_history'),
    path('select_dataset/<id_dataset>', views.select_dataset, name='select_dataset'),
    path('view_datasets/', views.view_dataset, name='view_datasets'),
    
]



