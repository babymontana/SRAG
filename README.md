#Proyecto SRAG

 Desarrollado en DJANGO y mySQL
## Requisitos

Para hacer deploy necesitan tener instalado el framework Django y pyhton.

## Librerias

En el archivo requirements.txt se encuentran las librerias y la versión que requiere el proyecto.

## Configuracion

En el archivo gasolineria/settings.py se encuentra la configuración del proyecto asi como los modulos que existen.

## Gasolineria

Es el módulo principal y sirve como front end en el sitio web principal 

## Analytics

Este módulo contiene la funcionalidad para consultar las estadisticas de uso de las llaves (Pendiente Spring 2)

## Developer

Este módulo contiene el CRUD de llaves en el front end del sitio web, Login y acceso a los servicios REST mandando como parametro la llaves

## Componentes

Si no estas familiarizado con Django aqui encontraras donde se encuentran los componentes y su funcionamiento

*  urls.py .- Aqui se encuentra las URL que se podran utilizar, expresiones regulares para su uso y a que vista corresponde.
*  views.py .- En esta parte se encuentra la lógica de las vistas, estas funciones se mandan llamar desde las URL definidas en urls.py
*  templates .- En este apartado encontraras el HTML que se utiliza como plantillas para inyectar datos provenientes de las vistas, una vista puede realizar la lógca y despues renderizar el resultado de su lógica en un template o mostrar directamente el contenido.
*  models.py .- En este apartado encontraras clases que corresponden a objetos en la lógica de negocio, como utilizamos el framework de Django DB estos objetos se serializan directamente en la base de datos.
*  static .- En este apartado encontraras los archivos que requieren los templates para su funcionamiento y vista del lado del cliente (css, js, images, etc).
