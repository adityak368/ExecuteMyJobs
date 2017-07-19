var io = require('../agentSocketManager')

function statusHandler(socket, job, jobOptions) {
    return function(data) {
        if(!data.isBusy) {
            io.getio().sockets.in(jobOptions.agent).emit('startjob', job)
            job.log('Agent Found. Started Job...')
        }
    }

}

module.exports = statusHandler