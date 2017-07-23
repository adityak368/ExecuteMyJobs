function jobLogHandler(job,socket,SocketIO) {
    return function(response) {
        log(job,response)
        SocketIO.of('/browser').emit('updateJobDetails', job)
    }
}

function log(job, msg) {
    if(job.attrs.data.log)
        job.attrs.data.log = job.attrs.data.log + msg
    else 
        job.attrs.data.log = msg
    job.save()
}

module.exports = jobLogHandler