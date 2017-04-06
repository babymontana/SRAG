from django.shortcuts import render
from django.http import HttpResponse
from developer.models import User,Key,Servicio,Periodo,Llamadas_Consultas
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json
import requests

#Portal inicial, verifica inicio de sesion o reedirecciona
def index(request):
     if request.session.has_key('user'):
          user = User.objects.get(pk=request.session['user'])
          keys = Key.objects.filter(user=user)
          return render(request,'estadistics/index.html',{'nombre':user.nombre,'keys':keys})
     else:
          return render(request,'analytics/error.html',{'error':'Porfavor inicia sesion!'})
          
#consulta de peticiones
@csrf_exempt
def consultas(request):
    keyId = request.POST['id']
    row = []
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) AS value, CONCAT(mes,'-',anio) AS label from developer_llamadas_consultas AS T1 INNER JOIN developer_periodo AS T2 ON T1.periodo_id=T2.id WHERE key_id=%s  GROUP BY mes;", [keyId])
        data = dictfetchall(cursor)
        d = [ {k:v.__str__() for k,v in tup.items()} for tup in data ]
    return HttpResponse(json.dumps(d))
    
#consulta de mapa
@csrf_exempt
def mapa(request):
    keyId = request.POST['id']
    row = []
    with connection.cursor() as cursor:
        cursor.execute("SELECT latitud as latitude , longitud as longitude, 2000 AS value from developer_llamadas_consultas  WHERE key_id=%s;", [keyId])
        data = dictfetchall(cursor)
        d = [ {k:v.__str__() for k,v in tup.items()} for tup in data ]
    return HttpResponse(json.dumps(d))
    
#consulta de servicios
@csrf_exempt
def servicios(request):
    keyId = request.POST['id']
    row = []
    with connection.cursor() as cursor:
        cursor.execute("SELECT count(*) AS value, nombre as label from developer_llamadas_consultas as T1 inner join developer_servicio as T2 on T1.servicio_id = T2.id WHERE key_id=%s;", [keyId])
        data = dictfetchall(cursor)
        d = [ {k:v.__str__() for k,v in tup.items()} for tup in data ]
    return HttpResponse(json.dumps(d))

#genera mapeo diccionario
def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]
        
