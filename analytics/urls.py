from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^estadistica$', views.estadistica),
    url(r'^api', views.api),
    url(r'^key', views.key),
    url(r'^error', views.error),
]