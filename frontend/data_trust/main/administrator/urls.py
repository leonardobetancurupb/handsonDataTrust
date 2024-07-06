
from django.urls import path
from . import views

app_name = 'administrator'
urlpatterns = [
    path('menu/', views.menu, name='menu'),
    path('create_policy/', views.create_policy, name='create_policy'),
    path('edit_policy/<id_policy>/', views.edit_policy, name='edit_policy'),
    path('create_schemas/', views.create_schema, name='create_schemas'),
    path('edit_schemas/<id_schema>/', views.edit_schema, name='edit_schemas'),
    path('schemas/', views.schemas, name='schemas'),
    path('policy/', views.policy, name='policy'),
    path('view_users/', views.view_users, name='view_users'),
    path('history_user/', views.history_user, name='history_user'),
    path('create_schemas/', views.create_schema, name='create_schemas'),
    path('edit_schemas/<id_schema>/', views.edit_schema, name='edit_schemas'),
    path('schemas/', views.schemas, name='schemas'),
]



