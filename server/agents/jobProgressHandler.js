function jobProgressHandler(job,socket) {
    return function(response) {
        console.log(response)
        progress(job, response)
    }
}

function progress(job, progress) {
    job.attrs.data.progress = progress
    job.save()
}

module.exports = jobProgressHandler