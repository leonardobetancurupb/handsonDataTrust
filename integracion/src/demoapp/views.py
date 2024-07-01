from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home_page_view(request):
    return HttpResponse("Hello, World!. If you're reading this, <B>django</B> is working.")    