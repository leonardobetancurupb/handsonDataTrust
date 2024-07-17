import json
from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render
from src.utils.logger import get_last_logs
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token


# Create your views here.
def menu(request):
    return render(request, 'menu.html')

def policy(request):
    return render(request, 'policy.html')

def schemas(request):
    return render(request, 'schemas.html')


def create_policy(request):
    return render(request, 'create_policy.html')

def edit_policy(request, id):
    return render(request, 'edit_policy.html')

def create_schema(request):
    return render(request, 'create_schemas.html')

def edit_schema(request, id):
    return render(request, 'edit_schemas.html')

def view_users(request):
    User = get_user_model()
    users = User.objects.all()  # Obtén todos los usuarios
    return render(request, 'view_users.html', {'users': users})

def history_user(request):
    return render(request, 'history_user.html')


def registered_data(request):
    return render(request, 'registered_data.html')

def history(request):
    return render(request, 'history.html')

def data_selected(request):
    return render(request, 'data_selected.html')

def create_category(request):
    return render(request, 'create_category.html')

def edit_category(request, id):
    return render(request, 'edit_category.html')

def category(request):
    return render(request, 'category.html')

def logs(request):
    # Ruta del archivo .txt (asegúrate de ajustar la ruta correctamente)
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
    if not request.user.is_authenticated:
        return HttpResponseForbidden("You are not authorized to perform this action.")
    
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return JsonResponse({'status': 'success'})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'})