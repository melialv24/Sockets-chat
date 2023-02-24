const { Usuarios } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensaje } = require('../utils/utilidades');


const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', (data , callback) => {

        if(!data.nombre || !data.sala) {
            if (typeof callback === "function") callback({
                error: true,
                mensaje: 'el nombre/sala es necesario'
            })
        }

        // Para unir a una sala
        client.join(data.sala)

         usuarios.agregarPersona(client.id, data.nombre, data.sala )
        
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala))

        if (typeof callback === "function") callback(usuarios.getPersonasPorSala(data.sala))
    })

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })

     client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id)

        //de esta manera le decimos que solamente emita el mensaje a la persona que queremos, en este caso enviamos el id
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))

    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id)
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje( 'Administrador', `${personaBorrada.nombre} abandono el chat.`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala))
    })

});