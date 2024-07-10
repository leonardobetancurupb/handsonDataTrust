
from django.urls import path
from . import views

app_name = 'administrator'
urlpatterns = [
    path('menu/', views.menu, name='menu'),
    path('create_policy/', views.create_policy, name='create_policy'),
    path('edit_policy/', views.edit_policy, name='edit_policy'),
    path('create_schemas/', views.create_schema, name='create_schemas'),
    path('edit_schemas/', views.edit_schema, name='edit_schemas'),
    path('schemas/', views.schemas, name='schemas'),
    path('policy/', views.policy, name='policy'),
    path('view_users/', views.view_users, name='view_users'),
    path('history_user/', views.history_user, name='history_user'),
    path('history/', views.history, name='history'),
    path('data_selected/', views.data_selected, name='data_selected'),
    path('registered_data/', views.registered_data, name='registered_data'),
]



