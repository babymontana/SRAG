from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^consultas', views.consultas, name='consultas'),
    url(r'^mapa', views.mapa, name='mapa'),
    url(r'^servicios', views.servicios, name='servicios'),
    url(r'^horas', views.horas, name='horas'),
    url(r'^precios', views.precios, name='precios'),
    url(r'^tiempo', views.tiempo, name='tiempo'),
    url(r'^size', views.size, name='size'),

]