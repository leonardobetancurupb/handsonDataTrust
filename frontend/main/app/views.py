from django.views.generic import TemplateView
import json
from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render
from django.core.cache import cache

def Index_view(request):
    template_name = 'master/index.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})
