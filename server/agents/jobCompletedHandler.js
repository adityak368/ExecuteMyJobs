function jobCompletedHandler(job,socket,SocketIO,done) {
    return function(response) {
        progress(job, 100)
        done()
        SocketIO.of('/browser').emit('update', job)
    }
}

function progress(job, progress) {
    job.attrs.data.progress = progress
    job.save()
}

module.exports = jobCompletedHandler