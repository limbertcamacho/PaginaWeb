var bd;
var cajaContactos;
function IniciarBaseDatos()
  {
    cajaContactos = document.querySelector(".caja-contactos");
    var BtnGuardar = document.querySelector("#btn-guardar");
    BtnGuardar.addEventListener("click", AlmacenarContacto);

    var solicitud = indexedDB.open("Datos-De-Contactos");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);
  }

function MostrarError(evento)
  {
      alert("Tenemos un ERROR: " + evento.code + " / " + evento.message);
  }

function Comenzar(evento)
  {
      bd = evento.target.result;
      //console.log("Funcion Comenzar");
      Mostrar();
  }

function CrearAlmacen(evento)
  {
      var basededatos = evento.target.result;
      var almacen = basededatos.createObjectStore("Contactos", {keyPath: "id"});
      almacen.createIndex("BuscarNombre", "nombre", {unique: false});
      //console.log("Funcion CrearAlmacen");
  }

function AlmacenarContacto()
  {
    var N = document.querySelector("#nombre").value;
    var I = document.querySelector("#id").value;
    var E = document.querySelector("#edad").value;

    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    transaccion.addEventListener("complete", Mostrar);
    almacen.add({
                 nombre: N,
                 id: I,
                 edad: E
               });

    document.querySelector("#nombre").value = "";
    document.querySelector("#id").value = "";
    document.querySelector("#edad").value = "";
  }
function Mostrar()
{
   cajaContactos.innerHTML = "";

   var transaccion = bd.transaction(["Contactos"]);
   var almacen = transaccion.objectStore("Contactos");
    
   var puntero = almacen.openCursor();
   puntero.addEventListener("success", MostrarContactos);
}
function MostrarContactos(evento)
{
   var puntero = evento.target.result;
   if(puntero)
     {
       cajaContactos.innerHTML += "<div>" +
                                         puntero.value.nombre + " /" +
                                         puntero.value.id + " / " +
                                         puntero.value.edad +
           "<input type='button' class='btn-editar ' value='Editar' onclick='seleccionarContacto(\""+puntero.value.id+"\")'>"+           
           "<input type='button' class='btn-borrar ' value='Borrar' onclick='eliminarContacto(\""+puntero.value.id+"\")'>"+
            "</div>";
         
         puntero.continue();
     }
}

function  seleccionarContacto(key){
    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    
    var solicitud=almacen.get(key);
    
    solicitud.addEventListener("success", function(){
    document.querySelector("#nombre").value = solicitud.result.nombre;
    document.querySelector("#id").value = solicitud.result.id;
    document.querySelector("#edad").value = solicitud.result.edad;
         
     });
    
    var padreBoton = document.querySelector(".padre-boton");
    padreBoton.innerHTML="<input type='button' class='btn-actualizar' value='Actualizar' onclick='actualizarContacto()'>";  
           
}
function actualizarContacto(){
    
    var N = document.querySelector("#nombre").value;
    var I = document.querySelector("#id").value;
    var E = document.querySelector("#edad").value;

    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    transaccion.addEventListener("complete", Mostrar);
    almacen.put({
                 nombre: N,
                 id: I,
                 edad: E
               });

    document.querySelector("#nombre").value = "";
    document.querySelector("#id").value = "";
    document.querySelector("#edad").value = "";
    
    var padreBoton = document.querySelector(".padre-boton");
     padreBoton.innerHTML="<input type='button' id='btn-guardar' value='Guardar' onclick='AlmacenarContacto()'>";
    
}
function  eliminarContacto(key){
    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
     transaccion.addEventListener("complete", Mostrar);
    var solicitud=almacen.delete(key);
}

window.addEventListener("load", IniciarBaseDatos);






























