import openpyxl.workbook
from .serializers import UserSerializer, CategorySerializer, HolderSerializer, ConsumerSerializer, AdminSerializer, SchemaSerializer, DataSerializer, PolicySerializer, CountCollectionSerializer
from .models import CustomUser, Category, Holder, Consumer, Admin, Data, Schema, Policy, CountCollection
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .decorators import admin_required, holder_required, consumer_required
from rest_framework import viewsets
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
import requests
import openpyxl
import bcrypt
import pandas as pd
import json
from .operations import Operations
import datetime
import os
import bcrypt
import pandas as pd
from glob import glob
import json
from .operations import Operations
import datetime
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from io import BytesIO
from django.http import HttpResponse
from pathlib import Path 
    
@csrf_exempt
def saveData(request, userType, idUser):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        types=['holder']
        #validamos tipo de usuario----------------------------------------------------------
        if userType not in types:
            return JsonResponse({'message':f'{userType} is not a valid type of user'})
        idHolderValidation= requests.get(f"http://127.0.0.1:8000/api/holders/{idUser}/", timeout=5)
        #validamos que id exista de holder---------------------------------------------------
        if idHolderValidation.status_code==404:
            return JsonResponse({'message':f'{userType} id doesnt exists'})
        elif 200<= idHolderValidation.status_code<300: #si id de usuario existe en holders
            holderInfo=idHolderValidation.json()
            #guardar archivo y retornar url--------------------------------------

            bodyData = request.POST.copy()
            if 'archivo' not in request.FILES:
                return JsonResponse({'error': 'No se envió ningún archivo'})
            archivo = request.FILES['archivo']
            fs = FileSystemStorage()
            
            schema= requests.get(f"http://127.0.0.1:8000/api/schema/{bodyData['idSchema']}/", timeout=5)
            
            extension=os.path.splitext(archivo.name)[1].lower()
            if extension !=".xlsx" and extension!=".xls" and extension!=".csv":
                return JsonResponse({"message":"not valid extension file"})

            schemaData=schema.json()

            name=schemaData['name']+"."+bodyData['format']
            path2="./documents_"+userType+"/"+idUser
            name=schemaData['name']+"."+bodyData['format']
            if os.path.exists(os.path.join(path2,name)):
                print("existe")
                print(os.path.join(path2,name))
                return JsonResponse({"error":"data already exist"})
            else:
                print("no existe")


            path="documents_"+userType+"/"+idUser
            if not os.path.exists(path):
                os.makedirs(path) 
            expectedHeaders= schemaData['structure'].split(" ")
            headersFile=""
            #leer archivo
            workbook=openpyxl.load_workbook(archivo)
            hoja=workbook.active
            for fila in hoja.iter_rows(values_only=True):
                headersFile=fila
                break

            if list(headersFile) != expectedHeaders:
                return JsonResponse({
                    "message":"headers file and headers schema are different",
                    "headersFile":headersFile,
                    "headersSchema":expectedHeaders
                })

            if bodyData['format']!=extension.replace(".",""):
                return JsonResponse({"message":"extension file is different than specific extension in format input"})




            filename = fs.save(os.path.join(path,name), archivo)
            urlFile = fs.url(filename) #url archivo guardado
            #-------------------------------------------------------------------
            #añadir info id y url a request de data
            #obtener conteo de id-------
            countBody= requests.get(f"http://127.0.0.1:8000/api/count/6/", timeout=5)
            bodyCountJson=countBody.json()
            if countBody.status_code==404: #si no se ha iniciado el conteo
                idActualConteo="0"
                payload = json.dumps({
                    "id": "6",
                    "collection": "Data",
                    "count": idActualConteo
                    })
                #se obtiene body de request data
                bodyData['id']=idActualConteo
                bodyData['url']=urlFile
                bodyData['idHolder']=idUser
                bodyData.update(bodyData)
                serializer = DataSerializer(data=bodyData)
                r=""
                if serializer.is_valid(raise_exception=True):#validamos todos los campos de data correctos
                    r=requests.request("POST","http://127.0.0.1:8000/api/data/", headers=headers, data=json.dumps(bodyData), timeout=5)
                    if 200 <= r.status_code <=300:
                        holderInfo['data'].append(idActualConteo)
                        Res= requests.request("PATCH",f"http://127.0.0.1:8000/api/holders/{idUser}/",headers=headers, data=json.dumps(holderInfo), timeout=5)        
                        if 200<= Res.status_code <300:
                            #print(Operations.send_log("CREATE",{
                            #    "description":"Creating new data",
                            #    "datetime":str(datetime.datetime.now()),
                            #    "creationStructure":str(bodyData)
                            #},idUser,"Person Collection"))
                            re=requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload, timeout=5)
                            if 200<=re.status_code<300:
                                return JsonResponse({'message':"status code OK"})
                            else:  
                                return JsonResponse({'message':f"status code post count: {re.status_code}"})
                        else:
                            return JsonResponse({'message':f"status code patch holder: {Res.status_code}"})
                    else:
                        return JsonResponse({'message':f"status code post data: {r.status_code}"})
                else:
                    return serializer.errors
            else:#si ya se habia iniciado el conteo
                idActualConteo=int(bodyCountJson['count']) #se obtiene el conteo en el que iba
                idActualConteo+=1 #se aumenta el conteo
                #se actualiza el id de data y la url
                bodyData['id']=idActualConteo
                bodyData['url']=urlFile
                bodyData['idHolder']=idUser
                #se actualiza conteo en el bodycount
                bodyCountJson['count']=str(idActualConteo)
                bodyData.update(bodyData)
                serializer = DataSerializer(data=bodyData)
                r=""
                if serializer.is_valid(raise_exception=True):#validamos todos los campos de data correctos
                    r=requests.request("POST","http://127.0.0.1:8000/api/data/", headers=headers, data=json.dumps(bodyData), timeout=5)
                    if 200 <= r.status_code <=300:
                        holderInfo['data'].append(idActualConteo)
                        Res= requests.request("PATCH",f"http://127.0.0.1:8000/api/holders/{idUser}/",headers=headers, data=json.dumps(holderInfo), timeout=5)        
                        if 200<= Res.status_code <300:
                            #print(Operations.send_log("CREATE",{
                            #    "description":"Creating new data",
                            #    "datetime":str(datetime.datetime.now()),
                            #    "creationStructure":str(bodyData)
                            #},idUser,"Person Collection"))
                            
                            re=requests.request("PATCH", "http://127.0.0.1:8000/api/count/6/", headers=headers, data=json.dumps(bodyCountJson), timeout=5)
                            if 200<=re.status_code<300:
                                return HttpResponse("OK")
                            else:  
                                return JsonResponse({'message':f"status code post count: {re.status_code}"})
                        else:
                            return JsonResponse({'message':f"status code patch holder: {Res.status_code}"})
                    else:
                        return JsonResponse({'message':f"status code post data: {r.status_code}"})
                else:
                    return serializer.errors
#-----------------------------------------------------------------------------------------------
        else:
            return JsonResponse({'message':f"idHolder dont exists: {idHolderValidation.status_code}"})
    elif request.method == 'GET':
        listFile=[]
        try:
            path=Path("documents_"+userType+"/"+idUser)
            for file in path.iterdir():
                if file.is_file():
                    listFile.append(file.name)
        except:
            return JsonResponse({"file List: ":listFile})
    return JsonResponse({'error': 'Method not resolved'}, status=405)


@csrf_exempt
def updateData(request,idData):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        #obtenemos data a actualizar
        dataBody= requests.get(f"http://127.0.0.1:8000/api/data/{idData}/", timeout=5)
        if dataBody.status_code == 404:
            return JsonResponse({"error":f"no data with id: {idData}"})
        dataData=dataBody.json()
        schemaBody=requests.get(f"http://127.0.0.1:8000/api/schema/{dataData['idSchema']}/", timeout=5)

        if 'archivo' not in request.FILES:
            return JsonResponse({'error': 'No se envio ningun archivo'})
        archivo = request.FILES['archivo']
        fs = FileSystemStorage()
        
        extension=os.path.splitext(archivo.name)[1].lower()
        if extension !=".xlsx" and extension!=".xls" and extension!=".csv":
            return JsonResponse({"error":"not valid extension file"})
        
        schemaData=schemaBody.json()
        expectedHeaders= schemaData['structure'].split(" ")
        headersFile=""

        if dataData['format']!=extension.replace(".",""):
            return JsonResponse({"message":"extension file is different than specific extension in format input"})

        #leer archivo
        workbook=openpyxl.load_workbook(archivo)
        hoja=workbook.active
        for fila in hoja.iter_rows(values_only=True):
            headersFile=fila
            break
        if list(headersFile) != expectedHeaders:
            return JsonResponse({
                "message":"headers file and headers schema are different",
                "headersFile":headersFile,
                "headersSchema":expectedHeaders
            })
        path="./"+dataData['url']
        if os.path.exists(path):
            os.remove(path)    
            filename = fs.save(path, archivo)
            urlFile = fs.url(filename)
            return JsonResponse({"url": urlFile})
        else:
            return JsonResponse({"error": f"{path} not exist"})
    else:
         return JsonResponse({'error': 'Method not resolved'}, status=405)


@csrf_exempt
def deleteData(request,idData):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        #obtenemos data a eliminar
        dataBody= requests.get(f"http://127.0.0.1:8000/api/data/{idData}/", timeout=5)
        if dataBody.status_code == 404:
            return JsonResponse({"error":f"no data with id: {idData}"})
        dataData=dataBody.json()
        path="."+dataData['url']
        if os.path.exists(path):
            os.remove(path)
            dataBody= requests.delete(f"http://127.0.0.1:8000/api/data/{idData}/", timeout=5)
            if 200<= dataBody.status_code <300:
                return HttpResponse("Ok")
            else:
                return HttpResponse(dataBody.status_code)
        else:
            return JsonResponse({"error": f"{path} not exist"})

    else:
         return JsonResponse({'error': 'Method not resolved'}, status=405)


@csrf_exempt
def downloadDataHolder(request,idHolder,idSchema):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        fs = FileSystemStorage()
        schemaBody= requests.get(f"http://127.0.0.1:8000/api/schema/{idSchema}/", timeout=5)
        if schemaBody==404:
            return JsonResponse({'message':f'schema with id {idSchema} not exists'})
        schemaData=schemaBody.json()
        path=f"documents_holder/{idHolder}/"
        file_paths = glob(os.path.join(fs.location, path, f"{schemaData['name']}.*"))

        if file_paths:
            full_path = file_paths[0]  # Assuming only one exact match
            with open(full_path, 'rb') as archivo:
                response = HttpResponse(archivo.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(full_path)}"'
                return response
        else:
            return HttpResponse('file not found', status=404)

@csrf_exempt
def sign(request):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        #obtener schema
        body=json.loads(request.body)
        schemaBody= requests.get(f"http://127.0.0.1:8000/api/schema/{body['idSchema']}/", timeout=5)
        if schemaBody.status_code==404:
            return JsonResponse({"Message":"there is not schema with that id"})
        schemaData=schemaBody.json()
        schemaEncryptFields=schemaData['fieldToEncrypt']
        header=schemaData['structure'].split(" ")
        lstDataId=body['lstDataId']
        #buscar archivos de esos id
        idHolderUrl="documents_holder/" 
        df=""
        workbook=openpyxl.Workbook()
        sheet=workbook.active
        sheet.append(header)
        id1=body['lstDataId'][0]
        dataBody= requests.get(f"http://127.0.0.1:8000/api/data/{id1}/", timeout=5)
        dataData=dataBody.json()
        r=""
        for id in lstDataId:
            dataBodyIndividual= requests.get(f"http://127.0.0.1:8000/api/data/{id}/", timeout=5)
            if dataBodyIndividual.status_code==404:
                return JsonResponse({"message":f"there is not data with id {id}"})
            dataDataIndividual = dataBodyIndividual.json()
            holderBody= requests.get(f"http://127.0.0.1:8000/api/holders/{dataDataIndividual['idHolder']}/", timeout=5)
            if holderBody.status_code==404:
                return JsonResponse({"message":"there is not holder with that id"})
            holderData=holderBody.json()
            holderData['authorization'][f"{body['idConsumer']}"]=schemaData['name']
            response = requests.patch(f"http://127.0.0.1:8000/api/holders/{dataDataIndividual['idHolder']}/", headers=headers, data=json.dumps(holderData), timeout=5)
            if response.status_code != 200:
                return JsonResponse({'message': f"Failed to update holder data. Status code: {response.status_code}"})
            
            idSelected=idHolderUrl+f"/{dataDataIndividual['idHolder']}/{schemaData['name']}.{dataData['format']}"
            df=pd.read_excel(idSelected)

            for column in schemaEncryptFields:
                df[column] = df[column].apply(lambda x: bcrypt.hashpw(str(x).encode('utf-8'), bcrypt.gensalt()))
            df.to_excel(idSelected, index=False)
            df1=pd.read_excel(idSelected)
            data=df1.values.tolist()
            for row in data:
                sheet.append(row)
        path=f"documents_consumer/{body['idConsumer']}/{schemaData['name']}"
        if not os.path.exists(path):
                os.makedirs(path)
        destiny=path+f"/{schemaData['name']}.{dataData['format']}"
        workbook.save(destiny)
        consumerBody= requests.get(f"http://127.0.0.1:8000/api/consumers/{body['idConsumer']}/", timeout=5)
        if consumerBody==404:
            return JsonResponse({'message':'consumir with idConsumer not exists'})
        consumerData=consumerBody.json()


        lst = consumerData['authorization'] + body['lstDataId']
        consumerData['authorization']=lst 
        r=requests.request("PATCH",f"http://127.0.0.1:8000/api/consumers/{body['idConsumer']}/", headers=headers, data=json.dumps(consumerData), timeout=5)
        if 200<=r.status_code<300:
            #print(Operations.send_log("UPDATE CONSUMPTION",{
                #    "description":"Adding dataset to authorization",
                #    "datetime":str(datetime.datetime.now()),
                #    "datasetId":str(body['lstDataId])
                #},body['idConsumer'],"Consumer Collection"))
            return JsonResponse({'message':r.status_code})
        else:
            return JsonResponse({'message':r.status_code})
    else:
        return JsonResponse({'message':'method no valid'})
        

@csrf_exempt
def downloadSchema(request,idSchema):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        schemaBody= requests.get(f"http://127.0.0.1:8000/api/schema/{idSchema}/", timeout=5)
        if schemaBody.status_code==404:
            return JsonResponse({'message':f'schema with id {idSchema} not exists'})
        
        schemaData=schemaBody.json()
        #---------------------------------
        lst = schemaData['structure'].split(" ")
        wb= openpyxl.Workbook()
        ws= wb.active
        headersXlsx=lst
        ws.append(headersXlsx)
        file_obj=BytesIO()
        wb.save(file_obj)
        file_obj.seek(0)
        name=schemaData['name']+".xlsx"
        response = HttpResponse(file_obj, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename={name}'
        return response


@csrf_exempt
def downloadEncrypted(request,idConsumer,idSchema):
    headers = {'Content-Type': 'application/json'}
    if request.method == 'POST':
        fs = FileSystemStorage()
        schemaBody= requests.get(f"http://127.0.0.1:8000/api/schema/{idSchema}/", timeout=5)
        if schemaBody==404:
            return JsonResponse({'message':f'schema with id {idSchema} not exists'})
        schemaData=schemaBody.json()
        path=f"documents_consumer/{idConsumer}/{schemaData['name']}/"
        file_paths = glob(os.path.join(fs.location, path, f"{schemaData['name']}.*"))

        if file_paths:
            full_path = file_paths[0]  # Assuming only one exact match
            with open(full_path, 'rb') as archivo:
                response = HttpResponse(archivo.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(full_path)}"'
                return response
        else:
            return HttpResponse('file not found', status=404)


User = get_user_model()

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/1/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "1",
                "collection": "Person",
                "count": idActual
                })
            body=json.loads(request.body)
            body['id']=idActual
            request.data.update(body)
            serializer = UserSerializer(data=request.data)
            
            if serializer.is_valid(raise_exception=True):
                user = self.perform_create(serializer)
                header = self.get_success_headers(serializer.data)
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new person",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":str(body)
                #},body['id'],"Person Collection"))
                requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)       
                return JsonResponse({'id':idActual})
            else:
                return serializer.errors
        else:
            idActual=int(data['count'])
            idActual+=1
            body=json.loads(request.body)
            body['id']=str(idActual)
            data['count']=str(idActual)
            request.data.update(body)
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = self.perform_create(serializer)
                header = self.get_success_headers(serializer.data)
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new person",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":str(body)
                #},body['id'],"Person Collection"))
                Res= requests.request("PATCH","http://127.0.0.1:8000/api/count/1/",headers=headers, data=json.dumps(data))        
                return JsonResponse({'id':idActual})
            else:
                return serializer.errors
    
    def update(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/registers/{kwargs['pk']}/")
        data=jsonData.json()
        body=json.loads(request.body)
        r=super().update(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("UPDATE",{
            #    "description":"Updating person",
            #    "datetime":str(datetime.datetime.now()),
            #    "oldValue":data,
            #    "newValue":str(body)
            #},"Admin","Person Collection"))
            return r
        else:
            return r
    
    def destroy(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/registers/{kwargs['pk']}/")
        data=jsonData.json()
        r=super().destroy(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("DELETE",{
            #    "description":"deleting person",
            #    "datetime":str(datetime.datetime.now()),
            #    "deletedValue":data
            #},"Admin","Person Collection"))
            return r
        else:
            return r.status_code 
    
    def retrieve(self, request, *args, **kwargs):
        r=super().retrieve(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("GET BY ID",{
            #    "description":"Getting Person",
            #    "datetime":str(datetime.datetime.now()),
            #    "searchedUserId":str(kwargs['pk'])
            #},"Admin","Person Collection"))
            return r 
        else:
            return r.status_code
    
    def list(self, request, *args, **kwargs):
        r=super().list(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:    
            #print(Operations.send_log("GET",{
            #    "description":"Getting People",
            #    "datetime":str(datetime.datetime.now())
            #},"Admin","Person Collection"))
            return r
        else:
            return r.status_code


    def perform_create(self, serializer):
        return serializer.save()
    
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'id': str(user.id),
            })
        else:
            return Response({'error': 'Error al iniciar sesión'})


class HolderViewSet(viewsets.ModelViewSet):
    queryset = Holder.objects.all()
    serializer_class = HolderSerializer
    def create(self, request, *args, **kwargs):
        body=json.loads(request.body)
        validationIdPerson= requests.get(f"http://127.0.0.1:8000/api/registers/{body['idPerson']}/")
        if validationIdPerson.status_code==404:
            return JsonResponse({'message':"idPerson not found"})
        if validationIdPerson.json()['role']!="holder":
            return JsonResponse({'message':"idPerson with role different to holder"})
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/2/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "2",
                "collection": "Holder",
                "count": idActual
                })
            body['id']=idActual
            body['data']=[]
            body['authorization']={}     
            request.data.update(body)
            serializer = HolderSerializer(data=request.data)
            r=""
            if serializer.is_valid(raise_exception=True):
                r=super().create(request, *args, **kwargs)
                if 200<=r.status_code<300:
                
                    #print(Operations.send_log("CREATE",{
                    #    "description":"Creating new person",
                    #    "datetime":str(datetime.datetime.now()),
                    #    "creationStructure":str(body)
                    #},body['id'],"Person Collection"))
                    requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)    
                    return r   
                else:
                    return JsonResponse({'message':f"holder status code: {r.status_code}"})
            else:
                return serializer.errors
        else:
            idActual=int(data['count'])
            idActual+=1
            body['id']=str(idActual)
            body['data']=[]
            body['authorization']={}    
            data['count']=str(idActual)
            request.data.update(body)
            serializer = HolderSerializer(data=request.data)
            r=""
            if serializer.is_valid(raise_exception=True):
                r=super().create(request, *args, **kwargs)
                if 200<=r.status_code<300:
                
                    #print(Operations.send_log("CREATE",{
                    #    "description":"Creating new person",
                    #    "datetime":str(datetime.datetime.now()),
                    #    "creationStructure":str(body)
                    #},body['id'],"Person Collection"))
                    Res= requests.request("PATCH","http://127.0.0.1:8000/api/count/2/",headers=headers, data=json.dumps(data))        
                    return r
                else:
                    return JsonResponse({'message':f"Holder status code: {r.status_code}"}) 
            else:
                return serializer.errors
    
    def update(self, request, *args, **kwargs):
        #print(Operations.send_log("UPDATE","Updating holder","User","Holder Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        #print(Operations.send_log("DELETE","Destroy holder","User","Holder Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        #print(Operations.send_log("GET_ID","Getting holder by id","User","Holder Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        #print(Operations.send_log("GET","getting holders","User","Holder Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)
    
class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer
    def create(self, request, *args, **kwargs):
        body=json.loads(request.body)
        validationIdPerson= requests.get(f"http://127.0.0.1:8000/api/registers/{body['idPerson']}/")
        if validationIdPerson.status_code==404:
            return JsonResponse({'message':"idPerson not found"})
        if validationIdPerson.json()['role']!="consumer":
            return JsonResponse({'message':"idPerson with role different to consumer"})
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/3/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "3",
                "collection": "Consumer",
                "count": idActual
                })
            body['id']=idActual
            body['authorization']=[]  
            request.data.update(body)
            serializer = ConsumerSerializer(data=request.data)
            r=""
            if serializer.is_valid(raise_exception=True):
                r=super().create(request, *args, **kwargs)
                if 200<=r.status_code<300:
                
                    #print(Operations.send_log("CREATE",{
                    #    "description":"Creating new person",
                    #    "datetime":str(datetime.datetime.now()),
                    #    "creationStructure":str(body)
                    #},body['id'],"Person Collection"))
                    requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)    
                    return r
                else:
                    return JsonResponse({'message':f"Consumer status code: {r.status_code}"})
            else:
                return serializer.errors
        else:
            idActual=int(data['count'])
            idActual+=1
            body['id']=str(idActual)
            body['authorization']=[]
            data['count']=str(idActual)
            request.data.update(body)
            serializer = ConsumerSerializer(data=request.data)
            r=""
            if serializer.is_valid(raise_exception=True):
                r=super().create(request, *args, **kwargs)
                if 200<=r.status_code<300:
                
                    #print(Operations.send_log("CREATE",{
                    #    "description":"Creating new person",
                    #    "datetime":str(datetime.datetime.now()),
                    #    "creationStructure":str(body)
                    #},body['id'],"Person Collection"))
                    Res= requests.request("PATCH","http://127.0.0.1:8000/api/count/3/",headers=headers, data=json.dumps(data))        
                    return r
                else:
                    return JsonResponse({'message':f"Consumer status code: {r.status_code}"})
            else:
                return serializer.errors
            
    def update(self, request, *args, **kwargs):
        #print(Operations.send_log("UPDATE","Updating consumer","User","Consumer Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        #print(Operations.send_log("DELETE","Destroy consumer","User","Consumer Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        #print(Operations.send_log("GET_ID","Getting consumer by id","User","Consumer Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        #print(Operations.send_log("GET","getting consumers","User","Consumer Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    def create(self, request, *args, **kwargs):
        body=json.loads(request.body)
        validationIdPerson= requests.get(f"http://127.0.0.1:8000/api/registers/{body['idPerson']}/")
        if validationIdPerson.status_code==404:
            return JsonResponse({'message':"idPerson not found"})
        if validationIdPerson.json()['role']!="admin":
            return JsonResponse({'message':"idPerson with role different to admin"})
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/4/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "4",
                "collection": "Admin",
                "count": idActual
                })
            body['id']=idActual 
            request.data.update(body)
            serializer = AdminSerializer(data=request.data)
            r=""
            if serializer.is_valid(raise_exception=True):
                r=super().create(request, *args, **kwargs)
                if 200<=r.status_code<300:
                
                    #print(Operations.send_log("CREATE",{
                    #    "description":"Creating new person",
                    #    "datetime":str(datetime.datetime.now()),
                    #    "creationStructure":str(body)
                    #},body['id'],"Person Collection"))
                    requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)    
                    return r   
                else:
                    return JsonResponse({'message':f"Admin status code: {r.status_code}"})
            else:
                return serializer.errors
        else:
            idActual=int(data['count'])
            idActual+=1
            body['id']=str(idActual)
            data['count']=str(idActual)
            request.data.update(body)
            serializer = AdminSerializer(data=request.data)
            r=""
            if serializer.is_valid(raise_exception=True):
                r=super().create(request, *args, **kwargs)
                if 200<=r.status_code<300:
                
                    #print(Operations.send_log("CREATE",{
                    #    "description":"Creating new person",
                    #    "datetime":str(datetime.datetime.now()),
                    #    "creationStructure":str(body)
                    #},body['id'],"Person Collection"))
                    Res= requests.request("PATCH","http://127.0.0.1:8000/api/count/4/",headers=headers, data=json.dumps(data))        
                    return r
                else:
                    return JsonResponse({'message':f"Admin status code: {r.status_code}"}) 
            else:
                return serializer.errors
            
    def update(self, request, *args, **kwargs):
        #print(Operations.send_log("UPDATE","Updating admin","User","Admin Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        #print(Operations.send_log("DELETE","Destroy admin","User","Admin Collection")) #TODO id person - source
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        #print(Operations.send_log("GET_ID","Getting admin by id","User","Admin Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        #print(Operations.send_log("GET","getting admins","User","Admin Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    @admin_required
    def create(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/5/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "5",
                "collection": "Policy",
                "count": idActual
                })
            body=json.loads(request.body)
            body['id']=idActual
            request.data.update(body)
            r=super().create(request, *args, **kwargs)
            if 200 <= r.status_code <= 202:
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new policy",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":str(body)
                #},"Admin","policy Collection"))
                
                requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)       
                return r
            else:
                return f"status code: {r.status_code}"
        else:      
            idActual=int(data['count'])
            idActual+=1
            body=json.loads(request.body)
            body['id']=str(idActual)
            data['count']=str(idActual)
            request.data.update(body)
            r=super().create(request, *args, **kwargs)
            
            if 200 <= r.status_code <= 202:
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new policy",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":str(body)
                #},"Admin","Category Collection"))
                Response= requests.request("PATCH","http://127.0.0.1:8000/api/count/5/",headers=headers, data=json.dumps(data))        
                return r
            else:
                return r

    @admin_required
    def update(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/policy/{kwargs['pk']}/")
        data=jsonData.json()
        body=json.loads(request.body)
        r=super().update(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("UPDATE",{
            #    "description":"Updating policy",
            #    "datetime":str(datetime.datetime.now()),
            #    "oldValue":data,
            #    "newValue":str(body)
            #},"Admin","Policy Collection"))
            return r
        else:
            return r

    @admin_required
    def destroy(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/policy/{kwargs['pk']}/")
        data=jsonData.json()
        r=super().destroy(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("DELETE",{
            #    "description":"deleting policy",
            #    "datetime":str(datetime.datetime.now()),
            #    "deletedValue":data
            #},"Admin","Policy Collection"))
            return r
        else:
            return r

    def retrieve(self, request, *args, **kwargs):
        r=super().retrieve(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("GET BY ID",{
            #    "description":"Getting policy",
            #    "datetime":str(datetime.datetime.now()),
            #    "searchedPolicyId":str(kwargs['pk'])
            #},"Admin","Policy Collection"))
            return r 
        else:
            return r

    def list(self, request, *args, **kwargs):
        r=super().list(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:    
           # print(Operations.send_log("GET",{
           #     "description":"Getting policies",
           #     "datetime":str(datetime.datetime.now())
           # },"Admin","Policy Collection"))
            return r
        else:
            return r

class DataViewSet(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        #print(Operations.send_log("UPDATE","Updating data","User","Data Collection")) #TODO id person - source
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):#TODO
        headers = {
                    'Content-Type': 'application/json'
                    }
        #eliminar de lista de holder
        jsonData= requests.get(f"http://127.0.0.1:8000/api/data/{kwargs['pk']}/")
        data=jsonData.json()
        print(data)
        jsonDataHolder= requests.get(f"http://127.0.0.1:8000/api/holders/{data['idHolder']}/")
        dataHolder=jsonDataHolder.json()
        dataHolder['data'].remove(int(data['id']))
        res= requests.request("PATCH",f"http://127.0.0.1:8000/api/holders/{data['idHolder']}/",headers=headers, data=json.dumps(dataHolder))        
        if 200<=res.status_code<300:
            #eliminar de filesystemstorage
            if os.path.exists(data['url']):
                os.remove(data['url'])
            else:
                return JsonResponse({'message':'IdData dont exists'})
        
            #eliminar de collection Data
            r=super().destroy(request, *args, **kwargs)
            if 200<=r.status_code<300:
                #print(Operations.send_log("DELETE","Destroy data","User","Data Collection")) #TODO id person - source
                return r
            else:
                return r.status_code 

    def retrieve(self, request, *args, **kwargs):
        #print(Operations.send_log("GET_ID","Getting data by id","User","Data Collection")) #TODO id person - source
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        #print(Operations.send_log("GET","getting data","User","Data Collection")) #TODO id person - source
        return super().list(request, *args, **kwargs)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    @admin_required
    def create(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/7/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "7",
                "collection": "Category",
                "count": idActual
                })
            body=json.loads(request.body)
            body['id']=idActual
            request.data.update(body)
            r=super().create(request, *args, **kwargs)
            if 200 <= r.status_code <= 202:
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new Category",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":str(body)
                #},"Admin","Category Collection"))
                requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)       
                return r
            else:
                return r
        else:      
            idActual=int(data['count'])
            idActual+=1
            body=json.loads(request.body)
            body['id']=str(idActual)
            data['count']=str(idActual)
            request.data.update(body)
            r=super().create(request, *args, **kwargs)
            
            if 200 <= r.status_code <= 202: 
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new Category",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":str(body)
                #},"Admin","Category Collection"))
                Response= requests.request("PATCH","http://127.0.0.1:8000/api/count/7/",headers=headers, data=json.dumps(data))        
                return r
            else:
                return r

    @admin_required
    def update(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/category/{kwargs['pk']}/")
        data=jsonData.json()
        body=json.loads(request.body)
        r=super().update(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("UPDATE",{
            #    "description":"Updating category",
            #    "datetime":str(datetime.datetime.now()),
            #    "oldValue":data,
            #    "newValue":str(body)
            #},"Admin","Category Collection"))
            return r
        else:
            return r

    @admin_required
    def destroy(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/category/{kwargs['pk']}/")
        data=jsonData.json()
        r=super().destroy(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("DELETE",{
            #    "description":"deleting category",
            #    "datetime":str(datetime.datetime.now()),
            #    "deletedValue":data
            #},"Admin","Category Collection"))
            return r
        else:
            return r 

    def retrieve(self, request, *args, **kwargs):
        r=super().retrieve(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:
            #print(Operations.send_log("GET BY ID",{
            #    "description":"Getting category",
            #    "datetime":str(datetime.datetime.now()),
            #    "searchedCategoryId":str(kwargs['pk'])
            #},"Admin","Category Collection"))
            return r 
        else:
            return r
   
    def list(self, request, *args, **kwargs):
        r=super().list(request, *args, **kwargs)
        if 200 <= r.status_code <= 300:    
            #print(Operations.send_log("GET",{
            #    "description":"Getting categories",
            #    "datetime":str(datetime.datetime.now())
            #},"Admin","Category Collection"))
            return r
        else:
            return r

class SchemaViewSet(viewsets.ModelViewSet):
    queryset = Schema.objects.all()
    serializer_class = SchemaSerializer
    @admin_required
    def create(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/count/8/")
        data=jsonData.json()
        headers = {
                    'Content-Type': 'application/json'
                    }
        if jsonData.status_code==404:
            idActual="0"
            payload = json.dumps({
                "id": "8",
                "collection": "Schema",
                "count": idActual
                })
            body=json.loads(request.body)
            body['id']=idActual
            request.data.update(body)
            r=super().create(request, *args, **kwargs)
            if 200 <= r.status_code <= 202:
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new schema",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":{
                #        "id":str(body['id']),
                #        "name": str(body['name']),
                #        "structure": str(body['structure']),
                #        "description":str(body['description'])
                #    }
                #},"Admin","Schema Collection"))
                requests.request("POST", "http://127.0.0.1:8000/api/count/", headers=headers, data=payload)       
                return r
            else:
                return r
        else:      
            idActual=int(data['count'])
            idActual+=1
            body=json.loads(request.body)
            body['id']=str(idActual)
            data['count']=str(idActual)
            request.data.update(body)
            r=super().create(request, *args, **kwargs)
            if 200 <= r.status_code <= 202:
                #print(Operations.send_log("CREATE",{
                #    "description":"Creating new schema",
                #    "datetime":str(datetime.datetime.now()),
                #    "creationStructure":{
                #        "id":str(body['id']),
                #        "name": str(body['name']),
                #        "structure": str(body['structure']),
                #        "description":str(body['description'])
                #    }
                #},"Admin","Schema Collection"))
                Response= requests.request("PATCH","http://127.0.0.1:8000/api/count/8/",headers=headers, data=json.dumps(data))        
                return r
            else:
                return r
            
    @admin_required
    def update(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/schema/{kwargs['pk']}/")
        data=jsonData.json()
        body=json.loads(request.body)
        r=super().update(request, *args, **kwargs)
        if 200 <= r.status_code <= 202:
            #print(Operations.send_log("UPDATE",{
            #    "description":"Updating schema",
            #    "datetime":str(datetime.datetime.now()),
            #    "oldValue":data,
            #    "newValue":str(body)
            #},"Admin","Schema Collection"))
            return r
        else:
            return r

    @admin_required    
    def destroy(self, request, *args, **kwargs):
        jsonData= requests.get(f"http://127.0.0.1:8000/api/schema/{kwargs['pk']}/")
        data=jsonData.json()
        r=super().destroy(request, *args, **kwargs)
        if 200 <= r.status_code <= 202:
            #print(Operations.send_log("DELETE",{
            #    "description":"deleting schema",
            #    "datetime":str(datetime.datetime.now()),
            #    "deletedValue":data
            #},"Admin","Schema Collection"))
            return r
        else:
            return r 

    def retrieve(self, request, *args, **kwargs):
        r=super().retrieve(request, *args, **kwargs)
        if 200 <= r.status_code <= 202:
            #print(Operations.send_log("GET BY ID",{
            #    "description":"Getting schema",
            #    "datetime":str(datetime.datetime.now()),
            #    "searchedUserId":str(kwargs['pk'])
            #},"Admin","Schema Collection"))
            return r 
        else:
            return r

    def list(self, request, *args, **kwargs):
        r=super().list(request, *args, **kwargs)
        if 200 <= r.status_code <= 202:    
            #print(Operations.send_log("GET",{
            #    "description":"Getting schemas",
            #    "datetime":str(datetime.datetime.now())
            #},"Admin","Schema Collection"))
            return r
        else:
            return r
            
class CountCollectionViewSet(viewsets.ModelViewSet):
    queryset = CountCollection.objects.all()
    serializer_class = CountCollectionSerializer
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

