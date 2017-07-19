var io = require('../agentSocketManager')

//agent job handlers
var jobLogHandler = require('../agents/jobLogHandler')
var jobProgressHandler = require('../agents/jobProgressHandler')
var jobCompletedHandler = require('../agents/jobCompletedHandler')
var jobErrorHandler = require('../agents/jobErrorHandler')


function getJobProcessor(){
    return function(job,done) {
    
        //configure job event handlers for socket
        if(io.getio().sockets.adapter.rooms[job.data.agent]) {
            var clientSockets = io.getio().sockets.adapter.rooms[job.data.agent].sockets
            Object.keys(clientSockets).forEach(function(socketId) {
                var socket = io.getio().sockets.sockets[socketId]
                if(socket) {
                    socket.on('joblog', jobLogHandler(socket, job))
                    socket.on('jobprogress', jobProgressHandler(socket, job))
                    socket.on('jobcompleted', jobCompletedHandler(socket, job,done))
                    socket.on('joberror', jobErrorHandler(socket, job, done))
                } else {
                    console.log('Could Not Connect to agent '+job.data.agent+'. Socket not found')
                    return
                }
            })
            
            io.getio().sockets.in(job.data.agent).emit('startjob', job)
            job.log('Agent Found. Started Job...')
        }
    }
}
module.exports = {
    getJobProcessor  :  getJobProcessor,
}