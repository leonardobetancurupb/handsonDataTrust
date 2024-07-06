from django.db import models

class Person(models.Model):
    id = models.CharField(primary_key=True, unique=True, max_length=100000)
    name = models.CharField(max_length=100)
    documentID = models.CharField(max_length=100)
    password=models.CharField(max_length=100)
    city=models.CharField(max_length=100)
    cellphone = models.CharField(max_length=20)
    email = models.CharField(max_length=100)
    role = models.JSONField()
    class Meta:
        app_label = 'app'

class Holder(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=100000)
    idPerson = models.ForeignKey(Person, on_delete=models.CASCADE)
    data = models.JSONField()
    authorization = models.JSONField()
    class Meta:
        app_label = 'app'


class Consumer(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=100000)
    idPerson = models.ForeignKey(Person, on_delete=models.CASCADE)
    company = models.CharField(max_length=100)
    nit= models.CharField(max_length=50)
    authorization = models.JSONField()
    class Meta:
        app_label = 'app'

class Admin(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=100000)
    idPerson = models.ForeignKey(Person, on_delete=models.CASCADE)
    nit= models.CharField(max_length=50)
    class Meta:
        app_label = 'app'

class Policy(models.Model):
    id = models.CharField(unique=True, primary_key=True, max_length=300)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    category = models.CharField(max_length=100)
    estimatedTime = models.CharField(max_length=100)
    Value = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        app_label = 'app'

class Category(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=100000)
    category = models.CharField(max_length=100)
    class Meta:
        app_label = 'app'

class Schema(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=100000)
    structure = models.JSONField(null=True)
    description = models.CharField(max_length=300)
    class Meta:
        app_label = 'app'

class Data(models.Model):
    id=models.CharField(primary_key=True, unique=True, max_length=100)
    idCategory = models.ForeignKey(Category, on_delete=models.CASCADE, max_length=100)
    format = models.CharField(max_length=10)
    idSchema = models.ForeignKey(Schema, on_delete=models.CASCADE, max_length=100)
    idPolicy = models.ForeignKey(Policy, on_delete=models.CASCADE, max_length=100)
    url = models.CharField(max_length=400)

    class Meta:
        app_label = 'app'
