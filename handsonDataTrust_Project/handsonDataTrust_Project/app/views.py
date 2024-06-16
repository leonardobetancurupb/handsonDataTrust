from rest_framework import viewsets
from .models import Person, Holder, Consumer, Admin, Policy, Data
from .serializers import PersonSerializer, HolderSerializer, ConsumerSerializer, AdminSerializer, PolicySerializer, DataSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PersonFilter
from .operations import Operations

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonFilter

    def create(self, request, *args, **kwargs):
        Operations.send_log("CREATE","Creating new Person","User","Person Collection")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        Operations.send_log("UPDATE","Updating person","User","Person Collection")
        return super().update(request, *args, **kwargs)

class HolderViewSet(viewsets.ModelViewSet):
    queryset = Holder.objects.all()
    serializer_class = HolderSerializer

class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer

class DataViewSet(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
