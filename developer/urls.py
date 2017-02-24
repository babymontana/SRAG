from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login$', views.login, name='login'),
    url(r'^register$', views.register, name='register'),
    url(r'^cerrarSesion$', views.cerrarSesion, name='cerrarSesion'),
    url(r'^addKey$', views.addKey, name='addKey'),
    url(r'^eliminarKey/(?P<pk>[0-9]+)$', views.eliminarKey, name='eliminarKey'),
    url(r'^estacionesSinCosto/(?P<key>[A-Za-z0-9]+)/(?P<latitud>[+-]?[0-9]+.?[0-9]+)/(?P<longitud>[+-]?[0-9]+.?[0-9]+)$', views.estacionesSinCosto, name='estacionesSinCosto'),
    url(r'^estacionesConCosto/(?P<key>[A-Za-z0-9]+)/(?P<latitud>[+-]?[0-9]+.?[0-9]+)/(?P<longitud>[+-]?[0-9]+.?[0-9]+)$', views.estacionesConCosto, name='estacionesConCosto'),
    url(r'^estacionesConsumo/(?P<key>[A-Za-z0-9]+)/(?P<latitud>[+-]?[0-9]+.?[0-9]+)/(?P<longitud>[+-]?[0-9]+.?[0-9]+)/(?P<rendimiento>[0-9]+.?[0-9]+)$', views.estacionesConsumo, name='estacionesConsumo'),

]