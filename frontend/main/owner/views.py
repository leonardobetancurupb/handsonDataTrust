import json
from django.shortcuts import render
from django.core.cache import cache
from django.shortcuts import redirect
import requests
from django.conf import settings


with open('/code/src/utils/key.txt', 'r') as file:
    key = file.read()
print(key)    

# Renders the main page (home.html) and passes the access token from the cache.
def menu(request):
    template_name = 'home.html'
    # Retrieves the access token from the cache.
    variable_value = cache.get('access', 'Variable not found')
    # Retrieves the user ID from the cache.
    id_user = cache.get('id_session')
    # Defines the URL to fetch holders.
    
    url = f"http://{key}:8000/api/holders/"
    payload = ""
    headers = {}
    # Makes a GET request to fetch holders.
    response = requests.request("GET", url, headers=headers, data=payload)

    # Filters the holders to get the one corresponding to the current user.
    filtrados = list(filter(lambda diccionario: diccionario["idPerson"] == id_user, response.json()))
    data = filtrados[0]
    
    # Passes the access token and the holder ID to the template context.
    context = {
        'token': variable_value,
        'id_holder': data['id']
    }
    # Renders the template with the context.
    return render(request, template_name, context)
# Handles dataset registration.
# If a POST request is made, it sends the file to a remote endpoint.
def register_datasets(request):
    template_name = 'register_datasets.html'
    # Retrieves the access token from the cache.
    variable_value = cache.get('access', 'Variable not found')
    # Retrieves the user ID from the cache.
    id_user = cache.get('id_session')
    # Defines the URL to fetch holders.
    
    url = f"http://{key}:8000/api/holders/"
    payload = ""
    headers = {}
    # Makes a GET request to fetch holders.
    response = requests.request("GET", url, headers=headers, data=payload)
    print(response.json())
    # Filters the holders to get the one corresponding to the current user.
    filtrados = list(filter(lambda diccionario: diccionario["idPerson"] == id_user, response.json()))
    data = filtrados[0]
    schema=0
    if request.method == 'POST':
        # Gets the file sent in the form.
        archivo = request.FILES['archivo']
        policy = request.POST.get('idPolicy')
        schema = request.POST.get('idSchema')
        format = request.POST.get('format')
        category = request.POST.get('idCategory')
        
        body={
            'idPolicy':policy,
            'idSchema': schema,
            'format': format,
            'IdCategory': category
        }
        # Defines the URL to send the file.
        url_file = f"http://{key}:8000/saveData/holder/{data['id']}/"
        files = {'archivo': archivo}
        # Makes a POST request to send the file.
        response = requests.request("POST", url_file, headers=headers, files=files, data=body)
        print(response.text)
        # Redirects to the 'schemas_owner' view after sending the file.
        return redirect('/holder/schemas_owner/')
    
    # Passes the access token and the holder ID to the template context.
    context = {
        'token': variable_value,
    }
    # Renders the template with the context.
    return render(request, template_name, context)

# Renders the 'about_holder.html' page and passes the access token from the cache.
def about(request):
    template_name = 'about_holder.html'
    # Retrieves the access token from the cache.
    variable_value = cache.get('access', 'Variable not found')
    # Renders the template with the access token.
    return render(request, template_name, {'token': variable_value})

# Renders the 'dataset_selected.html' page and passes the access token from the cache.
def dataset_selected(request, id):
    template_name = 'dataset_selected.html'
    # Retrieves the access token from the cache.
    variable_value = cache.get('access', 'Variable not found')
    
    # Retrieves the user ID from the cache.
    id_user = cache.get('id_session')
    # Defines the URLs to fetch holders and datasets.
    
    url = f"http://{key}:8000/api/holders/"
    url_data = f"http://{key}:8000/data/"
    payload = ""
    headers = {}
    
    # Makes GET requests to fetch holders and datasets.
    response = requests.request("GET", url, headers=headers, data=payload)
    response_data = requests.request("GET", url_data, headers=headers, data=payload, )
    
    # Filters the holders to get the one corresponding to the current user.
    filtrados = list(filter(lambda diccionario: diccionario["idPerson"] == id_user, response.json()))
    data = filtrados[0]
    
    # Filters the datasets to get the one corresponding to the current holder.
    filtrados_data = list(filter(lambda diccionario: diccionario["idHolder"] == data['id'], response_data.json()))
    dataset = filtrados_data[0]

    context = {
        'token': variable_value,
        'id_holder': data['id'],
        'id_schema': dataset['idSchema'],
        'id_data': dataset['id']
    }
    # Renders the template with the context.
    return render(request, template_name, context)

# Handles dataset editing.
# If a POST request is made, it sends the updated file to a remote endpoint.
def edit_datasets(request, id):
    template_name = 'edit_datasets.html'
    # Retrieves the access token from the cache.
    variable_value = cache.get('access', 'Variable not found')
    # Retrieves the user ID from the cache.
    payload = ""
    headers = {}
    id_user = cache.get('id_session')
    # Defines the URLs to fetch holders and datasets.
    url = f"http://{key}:8000/api/holders/"
    url_data = f"http://{key}:8000/data/"
    
    # Makes GET requests to fetch holders and datasets.
    response = requests.request("GET", url, headers=headers, data=payload)
    response_data = requests.request("GET", url_data, headers=headers, data=payload)
    
    # Filters the holders to get the one corresponding to the current user.
    filtrados = list(filter(lambda diccionario: diccionario["idPerson"] == id_user, response.json()))
    data = filtrados[0]
    
    # Filters the datasets to get the one corresponding to the current holder.
    filtrados_data = list(filter(lambda diccionario: diccionario["idHolder"] == data['id'], response_data.json()))
    dataset = filtrados_data[0]
    url = dataset['url']
    name = url.split('/')[3]
    
    if request.method == 'POST':
        # Gets the file sent in the form.
        archivo = request.FILES['archivo']
        # Defines the URL to send the updated file.
        url_file = f"http://{key}:8000/updateData/{dataset['id']}/"
        files = {'archivo': archivo}
        # Makes a POST request to send the updated file.
        response = requests.request("POST", url_file, headers=headers, files=files)
        
        # Redirects to the 'schemas_owner' view after sending the updated file.
        return redirect('/holder/schemas_owner/')
    
    # Passes the access token, holder ID, schema ID, and dataset ID to the template context.
    context = {
        'token': variable_value,
        'id_holder': data['id'],
        'id_schema': dataset['idSchema'],
        'id_data': dataset['id'],
        'url': name
    }
    # Renders the template with the context.
    return render(request, template_name, context)

# Renders the 'schemas_owner.html' page and passes the access token from the cache.
def schemas_owner(request):
    template_name = 'schemas_owner.html'
    # Retrieves the access token from the cache.
    variable_value = cache.get('access', 'Variable not found')
    # Renders the template with the access token.
    return render(request, template_name, {'token': variable_value})
