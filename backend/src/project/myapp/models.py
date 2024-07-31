"""
    Models are the main structure that you save in database. 
    Basically is the body for the http requests or manipulating objects of data
"""
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('holder', 'Holder'),
        ('admin', 'Admin'),
        ('consumer', 'Consumer'),
    ]
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='holder')

class Holder(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    idPerson = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    data = models.JSONField()
    authorization = models.JSONField()
    money=models.DecimalField(max_digits=10000000000, decimal_places=4)
    class Meta:
        app_label = 'app'


class Consumer(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    idPerson = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    company = models.CharField(max_length=100)
    nit= models.CharField(max_length=50)
    authorization = models.JSONField()
    moneyPaid = models.DecimalField(max_digits=10000000000, decimal_places=4)
    class Meta:
        app_label = 'app'

class Admin(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    idPerson = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    class Meta:
        app_label = 'app'

class Category(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    category = models.CharField(max_length=100)
    class Meta:
        app_label = 'app'

class Policy(models.Model):
    id = models.CharField(unique=True, primary_key=True, max_length=1000000000)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    idCategory = models.ForeignKey(Category, on_delete=models.CASCADE)
    estimatedTime = models.CharField(max_length=100)
    Value = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        app_label = 'app'

class CountCollection(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=20)
    collection = models.CharField(max_length=300)
    count = models.CharField(max_length=10000000)
    class Meta:
        app_label = 'app'

class Schema(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    name=models.CharField(max_length=300)
    structure = models.JSONField(null=True)
    fieldToEncrypt=models.JSONField()
    description = models.CharField(max_length=300)

    class Meta:
        app_label = 'app'

class Data(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=1000000000)
    idCategory = models.ForeignKey(Category, on_delete=models.CASCADE, max_length=100)
    format = models.CharField(max_length=10)
    idSchema = models.ForeignKey(Schema, on_delete=models.CASCADE, max_length=100)
    idPolicy = models.ForeignKey(Policy, on_delete=models.CASCADE, max_length=100)
    idHolder = models.ForeignKey(Holder, on_delete=models.CASCADE, max_length=100)
    url = models.CharField(max_length=400)

    class Meta:
        app_label = 'app'
