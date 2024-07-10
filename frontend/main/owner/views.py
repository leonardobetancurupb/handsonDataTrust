from django.shortcuts import render



# Create your views here.
def menu(request):
    return render(request, 'home.html')

def register_datasets(request):
    return render(request, 'register_datasets.html')

def dataset_selected(request):
    return render(request, 'dataset_selected.html')

def edit_datasets(request):
    return render(request, 'edit_datasets.html')

def schemas_owner(request):
    return render(request, 'schemas_owner.html')