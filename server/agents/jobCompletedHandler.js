function jobCompletedHandler(job,socke,done) {
    return function(response) {
        progress(job, 100)
        done()
    }
}

function progress(job, progress) {
    job.attrs.data.progress = progress
    job.save()
}

module.exports = jobCompletedHandler