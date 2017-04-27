import base64
import requests
import json
import datetime
from django.shortcuts import render,redirect
from django.http import HttpResponse
from .models import User,Key,Servicio,Periodo,Llamadas_Consultas,Hora
from Crypto.Cipher import AES
from django.db import IntegrityError
from django.utils.crypto import get_random_string

#Portal inicial, verifica inicio de sesion o reedirecciona
def index(request):
     if request.session.has_key('user'):
          user = User.objects.get(pk=request.session['user'])
          keys = Key.objects.filter(user=user)
          return render(request,'developer/index.html',{'nombre':user.nombre,'keys':keys})
     else:
          return render(request,'analytics/error.html',{'error':'Porfavor inicia sesion!'})

#Cerrar sesion         
def cerrarSesion(request):
     del  request.session['user']
     return redirect('/key')
     
#Registrar nuevo usuario
def register(request):
     if request.POST['password']==request.POST['password2']:
          secret_key = 'DWAS123Fdfd./%4_' 
          cipher = AES.new(secret_key,AES.MODE_ECB)
          password =base64.b64encode(cipher.encrypt(request.POST['password'].rjust(32)))
          try:
               user = User(correo=request.POST['correo'],nombre=request.POST['nombre'],password=password)
               user.save()
               request.session['user']=user.pk
               return redirect('/developer')
          except IntegrityError:
               return render(request, 'analytics/error.html',{'error':'Lo sentimos ese correo ya fue registrado!'})
     else:
               return render(request, 'analytics/error.html',{'error':'Lo sentimos las contrasenas no coinciden'})

#Valida inicio de sesion y crea cookie cifrada     
def login(request):
     secret_key = 'DWAS123Fdfd./%4_' 
     cipher = AES.new(secret_key,AES.MODE_ECB)
     password =base64.b64encode(cipher.encrypt(request.POST['password'].rjust(32)))
     try:
          user = User.objects.get(correo=request.POST['correo'])
          if user.password == password:
               request.session['user'] = user.pk
               return redirect('/developer')
          else:
              return render(request, 'analytics/error.html',{'error':'Contrasena incorrecta!'})
     except(User.DoesNotExist):
             return render(request, 'analytics/error.html',{'error':'Usuario incorrecto!'})
          
#Agregar nueva Key
def addKey(request):
     descripcion=request.POST['descripcion']
     user = User.objects.get(pk=request.session['user'])
     key = get_random_string(length=32)
     newKey = Key(user=user,descripcion=descripcion,key=key)
     newKey.save()
     return redirect('/developer')
     
#Eliminar key
def eliminarKey(request,pk):
     user = User.objects.get(pk=request.session['user'])
     key = Key(pk=pk, user=user)
     key.delete()
     return HttpResponse('{"response":"success"}')

#SERVICIOS

#Estaciones sin costo
def estacionesSinCosto(request,key,latitud,longitud):
     
     try:
          #iniciamos dimensiones de consulta
          key = Key.objects.get(key=key)
          servicio = Servicio.objects.get(nombre='estacionesSinCosto')
          d = datetime.date.today()
          t = datetime.datetime.now()
          periodo = Periodo.objects.get(dia=d.day,mes=d.month,anio=d.year)
          hora = Hora.objects.get(hora=t.hour)
     
          #definimos URL pemex
          url = "http://pronosticodemanda.pemex.com//WS_GP/Pemex.Servicios.svc/nearby2/"+latitud+"/"+longitud
          #Hacemos peticion y cachamos respuesta               
          respuesta = requests.request("GET", url, params={'category':'3'})
          #serializamos JSON
          struct = json.loads(respuesta.text)
          #sanetizamos datos y preparamos respuesta JSON
          datos=[]
          for element in struct['places']:
               datos.append({
                    'id':element['id'],
                    'direccion':element['place_address'],
                    'latitud':element['place_latitude'],
                    'longitud':element['place_longitude'],
                    'nombre':element['place_name'],
                    'distancia':element['distance']
               })
          envio = {'estatus':'success','gasolineras':datos}
          #enviamos respuesta http   
          #iniciamos objeto tabla de hechos
          consulta = Llamadas_Consultas(tiempo_minutos=0,costo_premium=0,costo_magna=0,latitud=latitud,hora=hora,longitud=longitud,key=key,periodo=periodo,servicio=servicio)
          #guardamos en la base de datos
          consulta.save()
          return HttpResponse(json.dumps(envio), content_type="application/json")
     except(Key.DoesNotExist):
          #llave no existe enviar error   
          envio = {'estatus':'error','mensaje':'llave incorrecta'}
          return HttpResponse(json.dumps(envio), content_type="application/json")
          
#Estacions con costo
def estacionesConCosto(request, key, latitud, longitud):
     try:
            #iniciamos dimensiones de consulta
          key = Key.objects.get(key=key)
          servicio = Servicio.objects.get(nombre='estacionesConCosto')
          d = datetime.date.today()
          t = datetime.datetime.now()
          periodo = Periodo.objects.get(dia=d.day,mes=d.month,anio=d.year)
          hora = Hora.objects.get(hora=t.hour)


          #definimos URL pemex
          url = "http://pronosticodemanda.pemex.com//WS_GP/Pemex.Servicios.svc/nearby2/"+latitud+"/"+longitud
          #Hacemos peticion y cachamos respuesta               
          respuesta = requests.request("GET", url, params={'category':'3'})
          #serializamos JSON
          struct = json.loads(respuesta.text)
          #sanetizamos datos y preparamos respuesta JSON
          datos=[]
          for element in struct['places']:
               #obtenemos precios
               precios={}
               for price in element['products']:
                    if price['price'] >0:
                       precios[price['name']]=price['price']
                       
               datos.append({
                    'id':element['id'],
                    'direccion':element['place_address'],
                    'latitud':element['place_latitude'],
                    'longitud':element['place_longitude'],
                    'nombre':element['place_name'],
                    'distancia':element['distance'],
                    'precios':precios
               })
          envio = {'estatus':'success','gasolineras':datos}
          #iniciamos objeto tabla de hechos
          consulta = Llamadas_Consultas(tiempo_minutos=0,costo_premium=precios['Premium'],costo_magna=precios['Magna'],latitud=latitud,hora=hora,longitud=longitud,key=key,periodo=periodo,servicio=servicio)
          #guardamos en la base de datos
          consulta.save()
          #enviamos respuesta http      
          return HttpResponse(json.dumps(envio), content_type="application/json")
     except(Key.DoesNotExist):
          #llave no existe enviar error   
          envio = {'estatus':'error','mensaje':'llave incorrecta'}
          return HttpResponse(json.dumps(envio), content_type="application/json")
          
#Estaciones consumo 
def estacionesConsumo(request,key,latitud, longitud, rendimiento):
     try:
            #iniciamos dimensiones de consulta
          key = Key.objects.get(key=key)
          servicio = Servicio.objects.get(nombre='estacionesConsumo')
          d = datetime.date.today()
          t = datetime.datetime.now()
          periodo = Periodo.objects.get(dia=d.day,mes=d.month,anio=d.year)
          hora = Hora.objects.get(hora=t.hour)

          #definimos URL pemex
          url = "http://pronosticodemanda.pemex.com//WS_GP/Pemex.Servicios.svc/nearby2/"+latitud+"/"+longitud
          #Hacemos peticion y cachamos respuesta               
          respuesta = requests.request("GET", url, params={'category':'3'})
          #serializamos JSON
          struct = json.loads(respuesta.text)
          #sanetizamos datos y preparamos respuesta JSON
          datos=[]
          for element in struct['places']:
               #obtenemos tiempo y distancia de mejor ruta con google maps
               url = "https://maps.googleapis.com/maps/api/directions/json"
               querystring = {"language":" es",
                              "origin":latitud+","+longitud,
                              "destination":element['place_latitude']+","+element['place_longitude'],
                              "key":"AIzaSyC-34GilUfbsujQGDnNNUB11VW8dgQ7Ux8"}
               #Hacemos peticion y cachamos respuesta   
               respuestaMap = requests.request("GET", url, params=querystring)
               #serializamos JSON
               structMap = json.loads(respuestaMap.text)
               #leemos la ruta
               ruta = structMap['routes'][0]
               inforuta = ruta['legs'][0]
               #obtenemos precios
               precios={}
               #calculamos gasto aproximado
               gasto = {}
               for price in element['products']:
                    if price['price'] >0:
                       precios[price['name']]=price['price']
                       gasto[price['name']]=round(float(price['price'])*float(rendimiento)*(float(inforuta['distance']['value'])/1000),2)
       
               datos.append({
                    'id':element['id'],
                    'direccion':element['place_address'],
                    'latitud':element['place_latitude'],
                    'longitud':element['place_longitude'],
                    'nombre':element['place_name'],
                    'distancia':inforuta['distance']['value'],
                    'tiempo':inforuta['duration']['value'],
                    'pasos':inforuta['steps'],
                    'precios':precios,
                    'gastoaproximado':gasto
                    
               })
          envio = {'estatus':'success','gasolineras':datos}
          #iniciamos objeto tabla de hechos
          consulta = Llamadas_Consultas(tiempo_minutos=inforuta['duration']['value'],costo_premium=precios['Premium'],costo_magna=precios['Magna'],latitud=latitud,hora=hora,longitud=longitud,key=key,periodo=periodo,servicio=servicio)
          #guardamos en la base de datos
          consulta.save()
          #enviamos respuesta http      
          return HttpResponse(json.dumps(envio), content_type="application/json")
     except(Key.DoesNotExist):
          envio = {'estatus':'error','mensaje':'llave incorrecta'}
          return HttpResponse(json.dumps(envio), content_type="application/json")