from django.shortcuts import render

# Create your views here.
def menu(request):
    return render(request, 'menu.html')

def policy(request):
    return render(request, 'policy.html')

def schemas(request):
    return render(request, 'schemas.html')


def create_policy(request):
    return render(request, 'create_policy.html')

def edit_policy(request):
    return render(request, 'edit_policy.html')

def create_schema(request):
    return render(request, 'create_schemas.html')

def edit_schema(request):
    return render(request, 'edit_schemas.html')

def view_users(request):
    return render(request, 'view_users.html')

def history_user(request):
    return render(request, 'history_user.html')


def registered_data(request):
    return render(request, 'registered_data.html')

def history(request):
    return render(request, 'history.html')

def data_selected(request):
    return render(request, 'data_selected.html')