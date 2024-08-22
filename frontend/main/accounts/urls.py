from django.urls import path

from .views import *
from . import views

app_name = 'accounts'

urlpatterns = [
    path('log-in/', views.LoginView, name='log_in'),
    path('log-out/confirm/', views.LogOutConfirm, name='log_out_confirm'),
    path('log-out/', views.LogOutView, name='log_out'),
    path('sign-up/', views.SignUpView, name='sign_up'),
    path('set_cache/', views.set_cache_variable, name='set_cache'),
    path('get_cache/', views.get_cache_variable, name='get_cache'),
    path('key/', views.key, name='key'),
    path('settings/', views.Setting, name="settings"),
    
]
