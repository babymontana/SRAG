$(document).ready(function(){
  
  var id = null;
 //Ajax para consultar estadisticas
    $(".opt").click(function(){
       $(".menu").css("display","inline-table");
       id =  $(this).attr("rel");
       $("#consultas").addClass("active");
       consultas(id);
       mapa(id);
       servicios(id);
       horas(id);
       precios(id);
       tiempo(id);
       consumo(id);
    });
    
 //Ajax numero consultas 
 
 
    
    function consultas(id){
     var data = {
        "id":id
       };
       
       $.ajax({
           type: "POST",
           url: "consultas",
           data: data,
           success: function(response){
                 var data =  jQuery.parseJSON(response)
                 var revenueChart = new FusionCharts({
                      type: 'column2d',
                      renderAt: 'chart-container',
                      width: '550',
                      height: '350',
                      dataFormat: 'json',
                      dataSource:{
            "chart": {
                "caption": "Consultas Mensuales",
                "subCaption": "SRAG Analytics",
                "xAxisName": "Meses",
                "yAxisName": "Consultas",
                "numberPrefix": "",
                "paletteColors": "#0075c2",
                "bgColor": "#ffffff",
                "borderAlpha": "20",
                "canvasBorderAlpha": "0",
                "usePlotGradientColor": "0",
                "plotBorderAlpha": "10",
                "placevaluesInside": "1",
                "rotatevalues": "1",
                "valueFontColor": "#ffffff",                
                "showXAxisLine": "1",
                "xAxisLineColor": "#999999",
                "divlineColor": "#999999",               
                "divLineIsDashed": "1",
                "showAlternateHGridColor": "0",
                "subcaptionFontBold": "0",
                "subcaptionFontSize": "14",
                "theme": "fint"
            },            
            "data":data ,
           
        }
                  }).render();
                         },
                  });
       
    }
    
    function servicios(id){
     var data = {
        "id":id
       };
       
       $.ajax({
           type: "POST",
           url: "servicios",
           data: data,
           success: function(response){
            var data =  jQuery.parseJSON(response)
             var ageGroupChart2 = new FusionCharts({
               type: 'pie3d',
               renderAt: 'chart-servicios',
               width: '450',
               height: '300',
               dataFormat: 'json',
               dataSource: {
                   "chart": {
                       "caption": "SRAG Analytics",
                       "subCaption": "Servicios consultados",
                       "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                       "bgColor": "#ffffff",
                       "showBorder": "0",
                       "use3DLighting": "0",
                       "showShadow": "0",
                       "enableSmartLabels": "0",
                       "startingAngle": "0",
                       "showPercentValues": "1",
                       "showPercentInTooltip": "0",
                       "decimals": "1",
                       "captionFontSize": "14",
                       "subcaptionFontSize": "14",
                       "subcaptionFontBold": "0",
                       "toolTipColor": "#ffffff",
                       "toolTipBorderThickness": "0",
                       "toolTipBgColor": "#000000",
                       "toolTipBgAlpha": "80",
                       "toolTipBorderRadius": "2",
                       "toolTipPadding": "5",
                       "showHoverEffect":"1",
                       "showLegend": "1",
                       "legendBgColor": "#ffffff",
                       "legendBorderAlpha": '0',
                       "legendShadow": '0',
                       "legendItemFontSize": '10',
                       "legendItemFontColor": '#666666',
                       "theme": "fint"
                   },
                   "data": data
               },
               "data":data
           }).render();
                   
                  },
                         });
           }
           
    function mapa(id){
    
      var data = {
        "id":id
       };
     
       $.ajax({
           type: "POST",
           url: "mapa",
           data: data,
           success: function(response){
            var data =  jQuery.parseJSON(response)
                   $('#map-chart').jHERE({
        enable: ['behavior', 'zoombar'], 
        center: [22.8609944,-100.3264327],
        zoom: 4.5
    }).jHERE('heatmap', data , 'density');
                   $("#map-chart").css("height","300px").css("width","600px");
                  },
            });
     
    }
           
    function horas(id){
     var data = {
        "id":id
       };
       
       $.ajax({
           type: "POST",
           url: "horas",
           data: data,
           success: function(response){
            var data =  jQuery.parseJSON(response);
            var label ="";
            var datos = "";
            for (d in data){
                label+=data[d].label+"|";
                datos+=data[d].value+"|"
                
            }
            FusionCharts.ready(function () {
    var visitChart = new FusionCharts({
        type: 'zoomline',
        renderAt: 'chart-horas',
        width: '600',
        height: '400',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Visitas por horarios",
                "subcaption": "Horas criticas",
                "yaxisname": "Numero de peticiones",
                "xaxisname": "Horas del dia",
                "yaxisminValue": "800",                
                "lineThickness": "1",
                "compactdatamode" : "1",
                "dataseparator" : "|",                
                //Pixel per point
                "pixelsPerPoint": "40",
                "theme": "fint"
            },
            "categories": [
                {
                    "category": label
                }
            ],
            "dataset": [
                {
                    "seriesname": "horas",
                    "data":datos
                }
            ]
        }
    });
    visitChart.render();
});
            
           },
                  });
    }
    
    function precios(id){
     var data = {
        "id":id
       };
       
       $.ajax({
           type: "POST",
           url: "precios",
           data: data,
           success: function(response){
            var data =  jQuery.parseJSON(response);
            var label =[];
            var magna = [];
            var premium = [];
            for (d in data){
                label[d]={"label":data[d].label+""};
                magna[d]={"value":data[d].magna+""};
                premium[d]={"value":data[d].premium+""};
                
            }
            
            FusionCharts.ready(function () {
    var revenueChart = new FusionCharts({
        type: 'mscombidy2d',
        renderAt: 'chart-precios',
        width: '600',
        height: '350',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Precio de gasolinas",
                    "subCaption": "Pemex",
                    "xAxisname": "Meses",
                    "pYAxisName": "Precio",
                    "sYAxisName": "Precio",
                    "numberPrefix": "$",
                    "sNumberSuffix" : "$",
                    "sYAxisMaxValue" : "20",
                    "numDivLines": "3",                    
                    "theme": "fint"
            },
            "categories": [{
                "category":label
            }],
            "dataset": [{
                "seriesName": "Magna",
                    "data": magna,
                    "renderAs": "line",
            }, {
                "seriesName": "Premium",
                "renderAs": "area",
                "data": premium
            }]
        }
    });

    revenueChart.render();
});
            
           },
                  });
    }
    
    function tiempo(id){
     var data = {
        "id":id
       };
       
       $.ajax({
           type: "POST",
           url: "tiempo",
           data: data,
           success: function(response){
            var data =  jQuery.parseJSON(response);
            FusionCharts.ready(function () {
    var salesChart = new FusionCharts({
        type: 'area2d',
        renderAt: 'chart-tiempo',
        width: '600',
        height: '300',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Tiempo de traslado  promedio",
                "subCaption": "Gasolinera más cercana",
                "xAxisName": "Meses",
                "yAxisName": "Tiempo",
                "numberPrefix": "",
                "theme": "fint",
                //Setting gradient fill to off.
            },            
            "data": data
        }
    }).render();
});
            
            
            
           },
                  });
    }
    
    function consumo(id){
     var data = {
        "id":id
       };
       
       $.ajax({
           type: "POST",
           url: "size",
           data: data,
           success: function(response){
            var data =  jQuery.parseJSON(response);
             FusionCharts.ready(function () {
    var revComp = new FusionCharts({
        type: 'hbullet',
        renderAt: 'chart-consumo',
        width: '500',
        height: '80',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "lowerLimit": "0",
                "upperLimit": "100",
                "caption": "Consumo de datos",
                "subcaption": "Promedio Menual",
                "numberPrefix": "",
                "numberSuffix": "mb",                
                "plotFillColor": "#0075c2",                
                "targetColor": "#8e0000",
                "showHoverEffect": "1",
                "showBorder": "0",
                "bgColor": "#ffffff",
                "showShadow": "0",
                "colorRangeFillMix": "{light+0}",                
                "valuePadding": "7"
            },
            "colorRange": {
                "color": [
                    {
                        "minValue": "0",
                        "maxValue": "50",
                        "code": "#1aaf5d",
                        "alpha": "70"
                    },
                    {
                        "minValue": "50",
                        "maxValue": "75",
                        "code": "#f2c500",
                        "alpha": "70"
                    },
                    {
                        "minValue": "75",
                        "maxValue": "120",
                        "code": "#e44a00",
                        "alpha": "70"
                    }
                ]
            },
            "value": data[0].value,
            
        }
    })
    .render();
});
            
            
            
           },
                  });
    }
});