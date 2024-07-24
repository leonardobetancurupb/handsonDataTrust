from django.shortcuts import render
from django.core.cache import cache


# Create your views here.
def menu(request):
    template_name = 'info.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def consumer_history(request):
    template_name = 'consumer_history.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})


def select_dataset(request, id):
    template_name = 'select_dataset.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})


def select_dataset_activated(request, id):
    template_name = 'select_dataset_activated.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})


def view_dataset(request):
    template_name = 'view_datasets.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

