function jobErrorHandler(job,socket,SocketIO,done) {
    return function(response) {
        done(new Error('Job Failed At Agent'))
        log(job,response)
        SocketIO.of('/browser').emit('update', job)
    }
}

function log(job, log) {
    if(!job.attrs.data.log)
        job.attrs.data.log = []
    job.attrs.data.log.push(log)
    job.save()
}

module.exports = jobErrorHandler