// Funciones para renderizar usuarios

//Referencias jQuery
const divUsuarios = $('#divUsuarios')
const formEnviar = $('#formEnviar')
const txtMensaje = $('#txtMensaje')
const divChatbox = $('#divChatbox')
const params = new URLSearchParams(window.location.search);

const nombre = params.get('nombre')
const sala = params.get('sala')

function renderizarUsuarios(personas) {

    let html = ""

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span>'+ params.get('sala')+'</span></a>';
    html += '</li>';

    for (let i = 0; i < personas.length; i++) {

        html +='<li>';
        html +=    '<a data-id="' + personas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
        html +='</li>';
    }

    divUsuarios.html(html)
}

function renderizarMensajes(mensaje, yo = false){
    let  html = '';
    const fecha = new Date(mensaje.fecha)
    const hora = fecha.getHours() + ':' + fecha.getMinutes()
    let adminClass = 'info'
    if(mensaje.nombre === 'Administrador'){
        adminClass = 'danger'
    }

    if(yo){
        html += '<li class="animated fadeIn">';
        if( mensaje.nombre !== 'Administrador') html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ mensaje.nombre +'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+ mensaje.mensaje +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }else{
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ mensaje.nombre +'</h5>';
        html += '        <div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += ' </li>';
    }

    divChatbox.append(html)
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners
divUsuarios.on('click', 'a', function(){
    //elemento al que le acabo de hacer click this data-id
    const id = $(this).data('id')
    if(id) console.log(id)
})

formEnviar.on('submit', function(e) {
    e.preventDefault()

    if(txtMensaje.val().trim().length === 0 ){
        return
    }

    // Enviar información
    socket.emit('crearMensaje', {
        nombre,
        mensaje:txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus()
        renderizarMensajes(mensaje, true)
        scrollBottom()
    });
})