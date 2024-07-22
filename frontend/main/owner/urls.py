
from django.urls import path
from . import views

app_name = 'holder'
urlpatterns = [
    path('home/', views.menu, name='home'),
    path('register_datasets/', views.register_datasets, name='register_datasets'),
    path('dataset_selected/<id>', views.dataset_selected, name='dataset_selected'),
    path('edit_datasets/<id>', views.edit_datasets, name='edit_datasets'),
    path('schemas_owner/', views.schemas_owner, name='schemas_owner'),
    
]



