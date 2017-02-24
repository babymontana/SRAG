$(document).ready(function(){
  
    // Ajax para eliminar llave
    $(".delete").click(function(){
      var key = $(this).attr("rel");
       swal({
          title: "¿Esta seguro de eliminar la llave?",
          text: "Las estadisticas de tu aplicación se perderan.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Si, quiero eliminar",
          closeOnConfirm: false
        },
        function(){
          $.get("eliminarKey/"+key,
          {},
          function(data){
            var res = JSON.parse(data);
            if (res.response=='success'){
                swal({ title: "Exito",
                      text: "Se eliminó exitosamente la llave.",
                      type: "success"},
                      function(){
                        location.reload();
                      });
                     
                
            }
          })
          
        });
      
    });
});