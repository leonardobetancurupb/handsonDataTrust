#Serializers can convert Models to JSON and JSON to Models
from rest_framework import serializers
from .models import Person, Holder

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class HolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holder
        fields = '__all__'
