from rest_framework import viewsets
from .models import Person, Holder
from .serializers import PersonSerializer, HolderSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PersonFilter

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonFilter

class HolderViewSet(viewsets.ModelViewSet):
    queryset = Holder.objects.all()
    serializer_class = HolderSerializer
