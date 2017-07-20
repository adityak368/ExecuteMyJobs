var identificationHandler = require('./identificationHandler')
var disconnectionHandler = require('./disconnectionHandler')
var jobLogHandler = require('./jobLogHandler')
var jobProgressHandler = require('./jobProgressHandler')
var jobCompletedHandler = require('./jobCompletedHandler')
var jobErrorHandler = require('./jobErrorHandler')
var statusHandler = require('./statusHandler')
var agenda = require('../jobs/agenda')

function handleConnection(SocketIO) {
    return function(clientSocket) {
        console.log('New Agent Connected ' + clientSocket.conn.remoteAddress.replace(/^.*:/, ''))

        if(clientSocket.handshake.query.name) {
            clientSocket.join(clientSocket.handshake.query.name)
            console.log(clientSocket.conn.remoteAddress.replace(/^.*:/, '') + ' joined to room ' + clientSocket.handshake.query.name)
        } else {
            clientSocket.disconnect()
            return
        }
        
        clientSocket.on('agentIdentification', identificationHandler(clientSocket))
        clientSocket.on('disconnect', disconnectionHandler.disconnectionHandlerOnConnect(clientSocket))

        agenda.define(clientSocket.handshake.query.name, function(job,done) {
            console.log('Processing Job ' + job.attrs._id)
            var clients = SocketIO.sockets.adapter.rooms[job.attrs.data.agent]
            if(clients) {
                var socket = SocketIO.sockets.sockets[Object.keys(clients.sockets)[0]]
                socket.removeAllListeners()

                socket.on('agentIdentification', identificationHandler(socket))
                socket.on('disconnect', disconnectionHandler.disconnectionHandlerAfterJobStart(job,clientSocket,done))
                socket.on('joblog', jobLogHandler(job,socket))
                socket.on('jobprogress', jobProgressHandler(job,socket) )
                socket.on('jobcompleted',jobCompletedHandler(job,socket,done) )
                socket.on('joberror', jobErrorHandler(job,socket,done))
                socket.on('status', statusHandler(job,socket))
                
                socket.emit('status', job)  
                console.log('Checking Agent Availability')
            }
        })
    }
}

module.exports = {
    handleConnection : handleConnection
}