from rest_framework import viewsets
from .models import Person, Holder, Consumer, Admin, Policy, Data, Category, Schema
from .serializers import PersonSerializer, HolderSerializer, ConsumerSerializer, AdminSerializer, PolicySerializer, DataSerializer, CategorySerializer, SchemaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PersonFilter
from .operations import Operations
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage

@csrf_exempt
def saveData(request):
    if request.method == 'POST':
        file = request.FILES['archivo']
        fs = FileSystemStorage()
        filename = fs.save(file.name, file)
        archivo_url = fs.url(filename)
        return JsonResponse({'urlfile': archivo_url})
    return JsonResponse({'error': 'invalid method'}, status=405)

def handle_uploaded_file(f):
    with open('some/file/name.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


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
        #Operations.saveData()
        print(Operations.send_log("CREATE","Inserting new data","User","Data Collection")) #TODO id person - source
        return super().create(request, *args, **kwargs)

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
