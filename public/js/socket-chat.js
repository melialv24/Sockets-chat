

var socket = io();
let params = new URLSearchParams(window.location.search)

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
} 

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    //Si yo me conecto o si el servidor me acepta yo ejecuto un callback
    socket.emit('entrarChat', usuario, (resp) => {
        console.log('Usuarios conectados',resp)
    })
});



// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('crearMensaje', {
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cambios de usuarios (entra o sale del chat)
socket.on('listaPersona', function(usuarios) {

    console.log('Usuarios:', usuarios);

});

//Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('mensaje privado', mensaje)
})