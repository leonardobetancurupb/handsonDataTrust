
from rest_framework import viewsets
from .models import Person, Holder, Consumer, Admin, Policy, Data, Category, Schema
from .serializers import PersonSerializer, HolderSerializer, ConsumerSerializer, AdminSerializer, PolicySerializer, DataSerializer, CategorySerializer, SchemaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PersonFilter
from .operations import Operations
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import os
from django.shortcuts import render
import requests
import json

@csrf_exempt
def saveData(request, userType, idUser):
    if request.method == 'POST':
        path=""+userType+"/"+idUser
        if not os.path.exists(path):
            os.makedirs(path)
        archivo = request.FILES['archivo']
        fs = FileSystemStorage()
        filename = fs.save(os.path.join(path,archivo.name), archivo)
        urlFile = fs.url(filename)
        return urlFile
    elif request.method == 'GET':
        fs = FileSystemStorage()
        archivos_guardados = fs.listdir(fs.location)[1]
        return JsonResponse({'archivos': archivos_guardados})
    return JsonResponse({'error': 'Method not resolved'}, status=405)


def downloadFile(request, filename):
    fs = FileSystemStorage()
    filePath = fs.url(filename)
    fullPath = os.path.join(fs.location, filename)

    if os.path.exists(fullPath):
        with open(fullPath, 'rb') as archivo:
            response = HttpResponse(archivo.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
    else:
        return HttpResponse('file not found', status=404)



class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonFilter

    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new Person","User","Person Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating person","User","Person Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy person","User","Person Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting person by id","User","Person Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting people","User","Person Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class HolderViewSet(viewsets.ModelViewSet):
    queryset = Holder.objects.all()
    serializer_class = HolderSerializer
    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new holder","User","Holder Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating holder","User","Holder Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy holder","User","Holder Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting holder by id","User","Holder Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting holders","User","Holder Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)
    
class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer
    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new consumer","User","Consumer Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating consumer","User","Consumer Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy consumer","User","Consumer Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting consumer by id","User","Consumer Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting consumers","User","Consumer Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new admin","User","Admin Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating admin","User","Admin Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy admin","User","Admin Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting admin by id","User","Admin Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting admins","User","Admin Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new policy","User","Policy Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating a policy","User","Policy Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy policy","User","Policy Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting policy by id","User","Policy Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting policies","User","Policy Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class DataViewSet(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    def create(self, request, *args, **kwargs):
        body=json.loads(request.body)
        idUser=body["idUser"]
        jsonData= requests.get(f"http://localhost:8000/holders/{idUser}/")
        data=jsonData.json()
        data['data'].append(json.loads(request.body)['id'])
        response= requests.put(f"http://localhost:8000/holders/{idUser}/",json=data)
        body_copy=body.copy()
        del body_copy['idUser']
        print("nuevo body a enviar a tabla data: ")
        print(body_copy)
        request.data.update(body_copy)
        r=super().create(request, *args, **kwargs)
        if r.status_code=="200":
            print(Operations.send_log("CREATE","Inserting new data","User","Data Collection")) #TODO id person - source
        else:
            print("status code: "+r.status_code)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating data","User","Data Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy data","User","Data Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting data by id","User","Data Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting data","User","Data Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new category","Admin","Category Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating category","Admin","Category Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy category","Admin","Category Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting category by id","Admin","Category Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting category","Admin","Category Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class SchemaViewSet(viewsets.ModelViewSet):
    queryset = Schema.objects.all()
    serializer_class = SchemaSerializer
    def create(self, request, *args, **kwargs):
        print(Operations.send_log("CREATE","Creating new schema","Admin","Schema Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(Operations.send_log("UPDATE","Updating schema","Admin","Schema Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        print(Operations.send_log("DELETE","Destroy schema","Admin","Schema Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(Operations.send_log("GET_ID","Getting schema by id","Admin","Schema Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        print(Operations.send_log("GET","getting schema","Admin","Schema Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)
