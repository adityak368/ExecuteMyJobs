var config = require('./config')
var agentTrack = require('./agents/agenttrack')
var io = null

function initSocketio(server) {
    io = require('socket.io')(server, {path : '/ExecuteByJobs/socket.io'})
    io.use(function(socket, next){
        // return the result of next() to accept the connection.
        if (socket.handshake.query.password === config.socketIoAuthPassword) {
            return next()
        }
        // call next() with an Error if you need to reject the connection.
        next(new Error('Authentication error'))
    })

    io.of('/browser').on('connection', function(socket){
        console.log('Browser connected with id %s', socket.id)
    })

    io.of('/agent').on('connection',  agentTrack.handleConnection(io))
}

function getio() {
    return io
}

module.exports = {
    initSocketio : initSocketio,
    getio : getio
}