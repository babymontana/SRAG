from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.template import loader


#paginas informativas
def index(request):
      return render(request, 'analytics/index.html')

def estadistica(request):
    return render(request, 'analytics/estadistica.html')
    
def api(request):
    return render(request, 'analytics/api.html')    

def key(request):
     if request.session.has_key('user'):
        return redirect('/developer') 
     else:
        return render(request, 'analytics/key.html')  

#pagina de error inicio de sesion developers
def error(request):
    return render(request, 'analytics/error.html')  