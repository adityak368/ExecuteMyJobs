var config = require('./config')
var io = null

function initSocketio(server) {
    io = require('socket.io')(server)
    io.use(function(socket, next){
        // return the result of next() to accept the connection.
        if (socket.handshake.query.password === config.socketIoAuthPassword) {
            return next()
        }
        // call next() with an Error if you need to reject the connection.
        next(new Error('Authentication error'))
    })

    var agentTrack = require('./agents/agenttrack')
    io.on('connection',  agentTrack.handleConnection)
}

function getio() {
    return io
}

module.exports = {
    initSocketio : initSocketio,
    getio : getio
}