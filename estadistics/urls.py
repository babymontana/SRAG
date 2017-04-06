from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^consultas', views.consultas, name='consultas'),
    url(r'^mapa', views.mapa, name='mapa'),
    url(r'^servicios', views.servicios, name='servicios'),

]