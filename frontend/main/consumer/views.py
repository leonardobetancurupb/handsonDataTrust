import json
from django.shortcuts import render
from django.core.cache import cache
import requests
from django.conf import settings
# View to render the main menu page


with open('frontend/main/src/utils/key.txt', 'r') as file:
        key = file.read()
        
def menu(request):
    template_name = 'info.html'
    # Retrieve the access token from the cache
    variable_value = cache.get('access', 'Variable not found')
    
    url2 = f"http://{key}:8000/api/consumers/"
    headers = {}
    payload = ""
    response2 = requests.get(url2, headers=headers, data=payload)
    consumers = response2.json()
    # Load the JSON data
    # consumers = json.loads(data)

    # Initialize totals
    total_money_paid = 0
    company= ""
    nit= ""
    # Retrieve the user session ID from the cache
    id_user = cache.get('id_session')
    # Iterate through each consumer
    for consumer in consumers:
        if consumer['idPerson']==id_user:
            company=consumer['company']
            nit=consumer['nit']
            # Convert moneyPaid to float for calculations
            money_paid = float(consumer["moneyPaid"])
            # Calculate the total money paid
            total_money_paid += money_paid
            break
    

    # Render the template with the access token
    # Define the context for the template
    context = {
        'token': variable_value,
        'total_money_paid': total_money_paid,
        "company": company,
        "nit": nit,
    }
    # Render the template with the context
    return render(request, template_name, context)

# View to render the consumer history page
def consumer_history(request):
    template_name = 'consumer_history.html'
    # Retrieve the access token from the cache
    variable_value = cache.get('access', 'Variable not found')
    # Render the template with the access token
    return render(request, template_name, {'token': variable_value})

# View to render the select dataset page
def select_dataset(request, id):
    template_name = 'select_dataset.html'
    # Retrieve the access token from the cache
    variable_value = cache.get('access', 'Variable not found')
    # Render the template with the access token
    return render(request, template_name, {'token': variable_value})

# View to render the select dataset activated page
def select_dataset_activated(request, id):
    template_name = 'select_dataset_activated.html'
    # Retrieve the access token from the cache
    variable_value = cache.get('access', 'Variable not found')
    # Retrieve the user session ID from the cache
    id_user = cache.get('id_session')
    
    # Define the API URL and headers
    url2 = f"http://{key}:8000/api/consumers/"
    headers = {}
    payload = ""

    # Fetch consumer data from the API
    response2 = requests.get(url2, headers=headers, data=payload)
    consumers = response2.json()
    
    # Filter the consumers to find the one matching the user ID
    filtered = [consumer for consumer in consumers if int(consumer["idPerson"]) == int(id_user)]
    data = filtered[0] if filtered else {}

    # Filter the authorization data to find the matching entry
    sign = [entry for entry in data.get('authorization', []) if entry["carpet"] == id]
    firm = sign[0] if sign else {}
    
    # Fetch the dataset from the API
    url = f"http://{key}:8000/api/data/{firm.get('lstSignedData', [])[0]}/"
    response = requests.get(url, headers=headers, data=payload)
    dataset = response.json()
    
    # Define the context for the template
    context = {
        'token': variable_value,
        'id_consumer': data.get('id'),
        'id_schema': dataset.get('idSchema'),
        'carpet': id
    }
    # Render the template with the context
    return render(request, template_name, context)

# View to render the view datasets page
def view_dataset(request):
    template_name = 'view_datasets.html'
    # Retrieve the access token from the cache
    variable_value = cache.get('access', 'Variable not found')
    # Render the template with the access token
    return render(request, template_name, {'token': variable_value})

# View to render the about consumer page
def about(request):
    template_name = 'about_consumer.html'
    # Retrieve the access token from the cache
    variable_value = cache.get('access', 'Variable not found')
    # Render the template with the access token
    return render(request, template_name, {'token': variable_value})
