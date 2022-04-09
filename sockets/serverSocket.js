const serverSocket = (socket) => {
    // cliente conectado
    // console.log('🟢 Cliente conectado: ', socket.handshake.headers['sec-ch-ua']);
    console.log('🟢 Cliente conectado: ', socket.id);

    // desconexion de clientes
    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado', socket.id);
    });
    
    // ID del cliente
    const id = (socket.id).substr(0, 5);

    // Enviar mensaje a cliente
    let row = 1;
    socket.on('enviar-mensaje', (payload, callback) => {
        console.log('💻 ➡ ', payload);
        callback(id);

        // mensaje a todos los clientes
        socket.emit('res-ser', payload, row, id);
        // implementar broadcost
        socket.broadcast.emit('res-ser', payload, row, id);

        row += 1;
    });

    // Borra mensajes de cliente
    socket.on('borrado:mensajes', (id) => {
        console.log('💥 Borrando mensajes, fila: ', id);

        socket.emit('borrado:mensajes', id);
        // implementar broadcost
        socket.broadcast.emit('borrado:mensajes', id);
    });
};

module.exports = {
    serverSocket
}