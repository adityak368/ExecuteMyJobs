var identificationHandler = require('./identificationHandler')
var disconnectionHandler = require('./disconnectionHandler')

function handleConnection(SocketIO) {
    return function(clientSocket) {
        console.log('New Agent Connected ' + clientSocket.conn.remoteAddress.replace(/^.*:/, ''))

        if(!clientSocket.handshake.query.name) {
            clientSocket.disconnect()
            return
        }
        
        clientSocket.on('agentIdentification', identificationHandler(clientSocket,SocketIO))
        clientSocket.on('disconnect', disconnectionHandler.disconnectionHandlerOnConnect(clientSocket))
    }
}

module.exports = {
    handleConnection : handleConnection
}