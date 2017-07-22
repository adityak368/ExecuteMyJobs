function jobProgressHandler(job,socket) {
    return function(response) {
        progress(job, response)
    }
}

function progress(job, progress) {
    job.attrs.data.progress = progress
    job.save()
}

module.exports = jobProgressHandler