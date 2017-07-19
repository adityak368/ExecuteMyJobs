var identificationHandler = require('./identificationHandler')
var disconnectionHandler = require('./disconnectionHandler')

function handleConnection(socket) {
    console.log('New Agent Connected ' + socket.conn.remoteAddress.replace(/^.*:/, ''))

    socket.on('agentIdentification', identificationHandler(socket))
    socket.on('disconnect', disconnectionHandler(socket))

    if(socket.handshake.query.name) {
        socket.join(socket.handshake.query.name)
        console.log(socket.conn.remoteAddress.replace(/^.*:/, '') + ' joined to room ' + socket.handshake.query.name)
    } else {
        socket.disconnect()
    }
 
}

module.exports = {
    handleConnection : handleConnection
}