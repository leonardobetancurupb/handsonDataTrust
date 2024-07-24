import json
from django.shortcuts import render
from django.core.cache import cache

import requests

# Create your views here.
def menu(request):
    template_name = 'home.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def register_datasets(request):
    template_name = 'register_datasets.html'
    variable_value = cache.get('access', 'Variable not found')
    id_user = cache.get('id_session')
    url = "http://54.197.173.166:8000/api/holders/"
    payload = ""
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    print(response.json())
    person=0

    filtrados = list(filter(lambda diccionario: diccionario["idPerson"] == id_user, response.json()))
    data=filtrados[0]
        # Aquí puedes hacer cualquier otro procesamiento necesario con selected_value
    context = {
            'token': variable_value,
            'id_holder': data['id']
        }
    return render(request, template_name, context)


# def soli_data(request,id):
#     if request.method == 'POST':
        


def dataset_selected(request,id):
    template_name = 'dataset_selected.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def edit_datasets(request,id):
    template_name = 'edit_datasets.html'
    variable_value = cache.get('access', 'Variable not found')
    id_user = cache.get('id_session')
    url = "http://54.197.173.166:8000/api/holders/"
    url_data = "http://54.197.173.166:8000/data/"
    payload = ""
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    response_data = requests.request("GET", url_data, headers=headers, data=payload)
    filtrados = list(filter(lambda diccionario: diccionario["idPerson"] == id_user, response.json()))
    data=filtrados[0]
    filtrados_data = list(filter(lambda diccionario: diccionario["idHolder"] == data['id'], response_data.json()))
    dataset=filtrados_data[0]
        # Aquí puedes hacer cualquier otro procesamiento necesario con selected_value
    context = {
            'token': variable_value,
            'id_holder': data['id'],
            'id_schema': dataset['idSchema'],
            'id_data': dataset['id']
        }
    return render(request, template_name, context)

def schemas_owner(request):
    template_name = 'schemas_owner.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})
