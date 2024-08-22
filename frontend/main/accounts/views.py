from django.contrib import messages
from django.contrib.auth import login, authenticate, REDIRECT_FIELD_NAME
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import (
    LogoutView as BaseLogoutView, PasswordChangeView as BasePasswordChangeView,
    PasswordResetDoneView as BasePasswordResetDoneView, PasswordResetConfirmView as BasePasswordResetConfirmView,
)
from django.views.generic.base import TemplateView
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.crypto import get_random_string
from django.utils.decorators import method_decorator
from django.utils.http import url_has_allowed_host_and_scheme as is_safe_url
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic import View, FormView
from django.conf import settings
from .models import *

from .utils import (
    send_activation_email, send_reset_password_email, send_forgotten_username_email, send_activation_change_email,
)
from .forms import (
    SignInViaUsernameForm, SignInViaEmailForm, SignInViaEmailOrUsernameForm, SignUpForm,
    RestorePasswordForm, RestorePasswordViaEmailOrUsernameForm, RemindUsernameForm,
    ResendActivationCodeForm, ResendActivationCodeViaEmailForm, ChangeProfileForm, ChangeEmailForm,
)
from .models import Activation


# views.py
from django.core.cache import cache
from django.http import JsonResponse
import json

def set_cache_variable(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        variable_name = data.get('key')
        print(variable_name)
        variable_value = data.get('value')

        # Guarda la variable en el cache
        cache.set(variable_name, variable_value, timeout=60*15)  # Expira en 15 minutos

        return JsonResponse({'status': 'success', 'message': f'{variable_name} set to cache'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


def LogOutConfirm(request):
    template_name = 'accounts/log_out_confirm.html'
    return render(request, template_name)

def LogOutView(request):
    template_name = 'accounts/log_out.html'
    return render(request, template_name)
    
    
def SignUpView(request):
    template_name = 'accounts/sign_up.html'
    return render(request, template_name) 

def LoginView(request):
    template_name = 'accounts/log_in.html'
    return render(request, template_name) 

def Setting(request):
    return render(request, 'accounts/setting.html')

def get_cache_variable(request):
    if request.method == 'GET':
        variable_name = request.GET.get('key')
        variable_value = cache.get(variable_name, 'Variable not found')
        return JsonResponse({'key': variable_name, 'value': variable_value})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

def key(request):
    return JsonResponse({
        'my_api_key': settings.MY_API_KEY,
    })