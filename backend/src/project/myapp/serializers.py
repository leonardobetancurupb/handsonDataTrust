"""
    Serializer class is essentially a class that converts complex data structures (like Django model instances) 
    into simple Python data types. 
    These simple data types can then be easily rendered into formats like JSON, XML, or other content types.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Holder, Consumer, Admin, Data, CountCollection, Policy, Schema, CustomUser

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            id=validated_data['id'],
            username=validated_data['username'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class HolderSerializer(serializers.ModelSerializer):
    idPerson = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    class Meta:
        model = Holder
        fields = ['id','idPerson', 'data', 'authorization','money']

class ConsumerSerializer(serializers.ModelSerializer):
    idPerson = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    class Meta:
        model = Consumer
        fields = ['id','idPerson','company','nit','authorization','moneyPaid']

class AdminSerializer(serializers.ModelSerializer):
    idPerson = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    class Meta:
        model = Admin
        fields = ['id','idPerson']

class CountCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountCollection
        fields = ['id','collection','count']

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
        fields = ['id','name','structure','description','fieldToEncrypt']

class DataSerializer(serializers.ModelSerializer):
    idCategory = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    idSchema = serializers.PrimaryKeyRelatedField(queryset=Schema.objects.all())
    idPolicy = serializers.PrimaryKeyRelatedField(queryset=Policy.objects.all())
    idHolder=serializers.PrimaryKeyRelatedField(queryset=Holder.objects.all())
    class Meta:
        model = Data
        fields = ['id','idCategory','format','idSchema','idPolicy','idHolder','url']

