from rest_framework import viewsets
from .models import Person, Holder, Consumer, Admin, Policy, Data
from .serializers import PersonSerializer, HolderSerializer, ConsumerSerializer, AdminSerializer, PolicySerializer, DataSerializer
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
        Operations.send_log("CREATE","Creating new Person","User","Person Collection") #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating person","User","Person Collection") #TODO id person - source
        return super().update(request, *args, **kwargs)

class HolderViewSet(viewsets.ModelViewSet):
    queryset = Holder.objects.all()
    serializer_class = HolderSerializer
    def create(self, request, *args, **kwargs):
        Operations.send_log("CREATE","Creating new holder","User","Holder Collection") #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating holder","User","Holder Collection") #TODO id person - source
        return super().update(request, *args, **kwargs)


class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer
    def create(self, request, *args, **kwargs):
        Operations.send_log("CREATE","Creating new consumer","User","Consumer Collection") #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating consumer","User","Consumer Collection") #TODO id person - source
        return super().update(request, *args, **kwargs)

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    def create(self, request, *args, **kwargs):
        Operations.send_log("CREATE","Creating new admin","User","Admin Collection") #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating admin","User","Admin Collection") #TODO id person - source
        return super().update(request, *args, **kwargs)


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    def create(self, request, *args, **kwargs):
        Operations.send_log("CREATE","Creating new policy","User","Policy Collection") #TODO id person - source
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating a policy","User","Policy Collection") #TODO id person - source
        return super().update(request, *args, **kwargs)


class DataViewSet(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    def create(self, request, *args, **kwargs):
        #Call function save data
        
        Operations.saveData()
        Operations.send_log("CREATE","Inserting new data","User","Data Collection") #TODO id person - source
        return super().create(request, *args, **kwargs)


    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating data","User","Data Collection") #TODO id person - source
        return super().update(request, *args, **kwargs)
