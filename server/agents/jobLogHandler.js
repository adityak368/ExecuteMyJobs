function jobLogHandler(job,socket,SocketIO) {
    return function(response) {
        log(job,response)
        SocketIO.of('/browser').emit('updateJobDetails', job)
    }
}

function log(job, log) {
    if(!job.attrs.data.log)
        job.attrs.data.log = []
    job.attrs.data.log.push(log)
    job.save()
}

module.exports = jobLogHandler