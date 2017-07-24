var identificationHandler = require('./identificationHandler')
var disconnectionHandler = require('./disconnectionHandler')

function handleConnection(SocketIO) {
    return function(clientSocket) {
        
        if(!clientSocket.handshake.query.name) {
            clientSocket.disconnect()
            return
        }

        console.log('New Agent Connected ' + clientSocket.handshake.query.name)// + clientSocket.conn.remoteAddress.replace(/^.*:/, ''))

        clientSocket.on('agentIdentification', identificationHandler(clientSocket,SocketIO))
        clientSocket.on('disconnect', disconnectionHandler.disconnectionHandlerOnConnect(clientSocket))
    }
}

module.exports = {
    handleConnection : handleConnection
}