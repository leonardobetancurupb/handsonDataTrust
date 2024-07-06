"""handsonDataTrust_Project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

"""
    Create (Crear): POST /persons/ o POST /holders/
    Retrieve (Recuperar): GET /persons/{id}/ o GET /holders/{id}/
    Update (Actualizar): PUT /persons/{id}/ o PUT /holders/{id}/
    Delete (Eliminar): DELETE /persons/{id}/ o DELETE /holders/{id}/
    List (Listar): GET /persons/ o GET /holders/
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .app import views

router = DefaultRouter()
router.register(r'persons', views.PersonViewSet)
router.register(r'holders', views.HolderViewSet)
router.register(r'consumers', views.ConsumerViewSet)
router.register(r'admin', views.AdminViewSet)
router.register(r'policy', views.PolicyViewSet)
router.register(r'data', views.DataViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'schema', views.SchemaViewSet)

urlpatterns = [
    path('', include(router.urls)),
#    path('saveData/', views.saveData, name='saveData'),
]
