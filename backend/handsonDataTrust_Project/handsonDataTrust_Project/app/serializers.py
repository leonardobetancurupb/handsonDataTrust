#Serializers can convert Models to JSON and JSON to Models
from rest_framework import serializers
from .models import Person, Holder, Consumer, Admin, Policy, Data

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class HolderSerializer(serializers.ModelSerializer):
    idPerson = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all())
    class Meta:
        model = Holder
        fields = ['id','idPerson', 'data', 'authorization']

class ConsumerSerializer(serializers.ModelSerializer):
    idPerson = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all())
    class Meta:
        model = Consumer
        fields = ['id','idPerson','company','nit','authorization']

class AdminSerializer(serializers.ModelSerializer):
    idPerson = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all())
    class Meta:
        model = Admin
        fields = ['id','idPerson','nit']

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = ['id','name','description','category','estimatedTime','Value']

class DataSerializer(serializers.ModelSerializer):
    idPolicy = serializers.PrimaryKeyRelatedField(queryset=Policy.objects.all())
    class Meta:
        model = Data
        fields = ['id','category','description','format','schema','idPolicy','url']