from django.db import models

class Person(models.Model):
    id = models.CharField(primary_key=True)
    name = models.CharField(max_length=100)
    documentID = models.CharField(max_length=100)
    city=models.CharField(max_length=100)
    cellphone = models.CharField(max_length=20)
    email = models.CharField()
    role = models.JSONField()
    class Meta:
        app_label = 'app'

class Holder(models.Model):
    idPerson = models.ForeignKey(Person, on_delete=models.CASCADE)
    idData = models.JSONField()
    Authorization = models.JSONField()
    class Meta:
        app_label = 'app'