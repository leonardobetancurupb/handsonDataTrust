import json
from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render
import requests
from src.utils.logger import get_all_logs, get_all_types, get_last_logs
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from django.core.cache import cache
from django.conf import settings


with open('/code/src/utils/key.txt', 'r') as file:
    key = file.read()
# Create your views here.
def menu(request):
    template_name = 'menu.html'
    variable_value = cache.get('access', 'Variable not found')
    
    
    headers = {}
    payload = ""
    
    url = f"http://{key}:8000/api/policy/"
    url2 = f"http://{key}:8000/api/consumers/"
    response2 = requests.get(url2, headers=headers, data=payload)
    response = requests.get(url,headers=headers, data=payload)
    policies=response.json()
    consumers = response2.json()
    # Load the JSON data
    # consumers = json.loads(data)

    # Initialize totals
    total_money_paid = 0
    total_20_percent = 0
    # Retrieve the user session ID from the cache
    id_user = cache.get('id_session')

    # Dictionary to quickly access policy values by their ID
    policy_values = {policy['id']: float(policy['Value']) for policy in policies}

    # Calculate the total value for each consumer
    for consumer in consumers:
        money_paid = float(consumer["moneyPaid"])
        total_money_paid += money_paid
        for auth in consumer['authorization']:
            policy_id = auth['idPolicy']
            policy_value = policy_values[policy_id]
            num_items = len(auth['lstSignedData'])
            
            # Calculate 20% of the policy value multiplied by the number of items
            total_20_percent += 0.2 * policy_value * num_items
            
    # Render the template with the access token
    # Define the context for the template
    context = {
        'token': variable_value,
        'total_money_paid': round(total_money_paid, 2),
        'total_20_percent': round(total_20_percent, 2)
    }
    # Render the template with the context
    return render(request, template_name, context)


def policy(request):
    template_name = 'policy.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def schemas(request):
    template_name = 'schemas.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})


def create_policy(request):
    template_name = 'create_policy.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def edit_policy(request, id):
    template_name = 'edit_policy.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def create_schema(request):
    template_name = 'create_schemas.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def edit_schema(request, id):
    template_name = 'edit_schemas.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def view_users(request):
    template_name = 'view_users.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def about(request):
    template_name = 'about_admin.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})


def registered_data(request):
    template_name = 'registered_data.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def history(request):
    template_name = 'history.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def data_selected(request, id):
    template_name = 'data_selected.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def create_category(request):
    template_name = 'create_category.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def edit_category(request, id):
    template_name = 'edit_category.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def category(request):
    template_name = 'category.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

def logs(request):
    
    try:
        response = get_all_logs()

    except Exception as e:
        return JsonResponse({'error': 'Not logs found.'}, status=404)
    
    # Retornar la respuesta JSON
    return JsonResponse(response, safe=False, json_dumps_params={'indent': 4})


@require_http_methods(["DELETE"])
def delete_user(request, user_id):

    User = get_user_model()
    variable_value = cache.get('access', 'Variable not found')
    if variable_value == "Variable not found":
        return HttpResponseForbidden("You are not authorized to perform this action.")
    
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return JsonResponse({'status': 'success'})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'})
    
    
def echarts_types(request):
    data_dict=get_all_types()
    data_list = [{'value': int(value), 'name': key} for key, value in data_dict.items()]
    return JsonResponse(data_list, safe=False)