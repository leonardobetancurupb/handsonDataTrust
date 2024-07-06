from django.shortcuts import render



# Create your views here.
def menu(request):
    return render(request, 'info.html')

def consumer_history(request):
    return render(request, 'consumer_history.html')

def select_dataset(request):
    return render(request, 'select_dataset.html')

def view_dataset(request):
    return render(request, 'view_datasets.html')