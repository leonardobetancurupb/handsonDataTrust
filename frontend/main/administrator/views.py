import json
from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render
from src.utils.logger import get_last_logs
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from django.core.cache import cache

# Create your views here.
def menu(request):
    template_name = 'menu.html'
    variable_value = cache.get('access', 'Variable not found')
    return render(request, template_name, {'token':variable_value})

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

def history_user(request):
    template_name = 'history_user.html'
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

def data_selected(request):
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
    
    # Ruta del archivo .txt
    input_file = 'src/utils/audit.txt'
    
    records = []
    
    # Leer y procesar el archivo
    try:
        with open(input_file, 'r') as file:
            lines = file.readlines()
        
        for line in lines:
            try:
                record = json.loads(line.strip())
                records.append(record)
            except json.JSONDecodeError as e:
                print(f"Error decodificando la línea: {line.strip()} - {e}")

    except FileNotFoundError as e:
        return JsonResponse({'error': 'Archivo no encontrado'}, status=404)
    
    # Retornar la respuesta JSON
    return JsonResponse(records, safe=False, json_dumps_params={'indent': 4})


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
    
    
def logs_example(request):
    return JsonResponse(get_last_logs(10), safe=False)