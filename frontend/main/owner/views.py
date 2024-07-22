from django.shortcuts import render
from django.core.cache import cache


# Create your views here.
def menu(request):
    template_name = 'home.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def register_datasets(request):
    template_name = 'register_datasets.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def dataset_selected(request,id):
    template_name = 'dataset_selected.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def edit_datasets(request,id):
    template_name = 'edit_datasets.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def schemas_owner(request):
    template_name = 'schemas_owner.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})
