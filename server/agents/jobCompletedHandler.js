var io = require('../agentSocketManager')

function jobCompletedHandler(socket, job, done) {
    return function(response) {
        if(job) {
            done()
            if(io.getio().sockets.adapter.rooms[job.data.agent]) {            
                io.getio().sockets.in(job.data.agent).emit('status', job)
            }
        }
        else
            console.log('JobCompleteHandling for '+job.type+' failed')
    }

}

module.exports = jobCompletedHandler