from __future__ import unicode_literals
from django.db import models

# Create your models here.
class User(models.Model):
    nombre = models.CharField(max_length=200)
    correo = models.CharField(max_length=200,unique=True)
    password = models.CharField(max_length=200)

class Key(models.Model):
    key=models.CharField(max_length=200)
    descripcion = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Periodo(models.Model):
    dia = models.CharField(max_length=2)
    mes = models.CharField(max_length=2)
    anio = models.CharField(max_length=4)

class Hora(models.Model):
    hora = models.CharField(max_length=2)

class Servicio(models.Model):
    nombre = models.CharField(max_length=200)
    
class Llamadas_Consultas(models.Model):
    key = models.ForeignKey(Key, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    periodo = models.ForeignKey(Periodo, on_delete=models.CASCADE)
    hora = models.ForeignKey(Hora, on_delete=models.CASCADE,default=None)
    latitud = models.CharField(max_length=200)
    longitud = models.CharField(max_length=200)
    costo_premium = models.CharField(max_length=4,default=None)
    costo_magna = models.CharField(max_length=4,default=None)
    tiempo_minutos =models.CharField(max_length=6,default=None) 
    

