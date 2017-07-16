var identificationHandler = require('./identificationHandler')
var disconnectionHandler = require('./disconnectionHandler')

function handleConnection(socket) {
    console.log('New Agent Connected ' + socket.conn.remoteAddress.replace(/^.*:/, ''))
    socket.on('agentIdentification', identificationHandler(socket))
    socket.on('disconnect', disconnectionHandler(socket))
}

module.exports = {
    handleConnection : handleConnection
}