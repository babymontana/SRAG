$(document).ready(function(){
  
  var id = null;
 //Ajax para consultar estadisticas
    $(".opt").click(function(){
       $(".menu").css("display","inline-table");
       id =  $(this).attr("rel");
       $("#consultas").addClass("active");
       consultas(id);
       mapa(id);
    });
    
 //Ajax numero consultas 
 
 $("#consultas").click(function(){
    $(".selections").removeClass("active");
    $("#consultas").addClass("active");
     consultas(id);
     $("#chart-container").fadeIn();
    $("#map-chart").fadeOut();
     
 });
 
 //Ajax servicios
 $("#servicios").click(function() {
     $(".selections").removeClass("active");
    $("#servicios").addClass("active");
     servicios(id);
     $("#chart-container").fadeIn();
    $("#map-chart").fadeOut();
 });
 
 $("#mapa").click(function() {
       $(".selections").removeClass("active");
    $("#mapa").addClass("active");
    $("#chart-container").fadeOut();
    $("#map-chart").fadeIn();
     
 });
    
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
                "subcaptionFontSize": "14"
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
             var ageGroupChart = new FusionCharts({
               type: 'pie3d',
               renderAt: 'chart-container',
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
                       "legendItemFontColor": '#666666'
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
           
    
});