#Serializers can convert Models to JSON and JSON to Models
from rest_framework import serializers
from .models import Person, Holder, Consumer, Admin, Policy, Data, Schema, Category

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
        fields = ['id','name','description','idCategory','estimatedTime','Value']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','category']

class SchemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schema
        fields = ['id','structure','description']

class DataSerializer(serializers.ModelSerializer):
    idCategory = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    idSchema = serializers.PrimaryKeyRelatedField(queryset=Schema.objects.all())
    idPolicy = serializers.PrimaryKeyRelatedField(queryset=Policy.objects.all())
    class Meta:
        model = Data
        fields = ['id','idCategory','format','idSchema','idPolicy','url']

