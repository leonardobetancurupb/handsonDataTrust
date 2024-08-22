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
    # path('activate/<code>/', ActivateView.as_view(), name='activate'),

    # path('restore/password/', RestorePasswordView.as_view(), name='restore_password'),
    # path('restore/password/done/', RestorePasswordDoneView.as_view(), name='restore_password_done'),
    # path('restore/<uidb64>/<token>/', RestorePasswordConfirmView.as_view(), name='restore_password_confirm'),

    # path('remind/username/', RemindUsernameView.as_view(), name='remind_username'),

    # path('change/profile/', ChangeProfileView.as_view(), name='change_profile'),
    # path('change/password/', ChangePasswordView.as_view(), name='change_password'),
    # path('change/email/', ChangeEmailView.as_view(), name='change_email'),
    # path('change/email/<code>/', ChangeEmailActivateView.as_view(), name='change_email_activation'),
    path('settings/', views.Setting, name="settings"),
    
]
