"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from django.contrib import admin
from myapp import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'registers', views.RegisterViewSet)
router.register(r'category', views.CategoryViewSet, basename="category")
router.register(r'holders', views.HolderViewSet)
router.register(r'consumers', views.ConsumerViewSet)
router.register(r'admin', views.AdminViewSet)
router.register(r'policy', views.PolicyViewSet)
router.register(r'data', views.DataViewSet)
router.register(r'schema', views.SchemaViewSet)
router.register(r'count', views.CountCollectionViewSet)


urlpatterns = [
    
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('saveData/<str:userType>/<str:idUser>/', views.saveData, name='saveData'),
    path('updateData/<str:idData>/', views.updateData, name='updateData'),
    path('deleteData/<str:idData>/', views.deleteData, name='deleteData'),
    path('downloadSchema/<str:idSchema>/', views.downloadSchema, name='downloadSchema'),
    path('downloadDataHolder/<str:idHolder>/<str:idSchema>/', views.downloadDataHolder, name='downloadDataHolder'),
    path('downloadEncrypted/<str:idConsumer>/<str:idSchema>/', views.downloadEncrypted, name='downloadEncrypted'),
    path('sign/', views.sign, name='sign'),
    path('api/', include(router.urls)),
]
