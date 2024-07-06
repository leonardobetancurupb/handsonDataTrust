from django.shortcuts import render



# Create your views here.
def menu(request):
    return render(request, 'home.html')

def datasets(request):
    return render(request, 'datasets.html')

def register_datasets(request):
    return render(request, 'register_datasets.html')

def schemas_owner(request):
    return render(request, 'schemas_owner.html')