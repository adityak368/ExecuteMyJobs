function jobProgressHandler(job,socket,SocketIO) {
    return function(response) {
        progress(job, response)
        SocketIO.of('/browser').emit('updateJobDetails', job)
    }
}

function progress(job, progress) {
    job.attrs.data.progress = progress
    job.save()
}

module.exports = jobProgressHandler