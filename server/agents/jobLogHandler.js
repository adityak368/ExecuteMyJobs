function jobLogHandler(job,socket) {
    return function(response) {
        log(job,response)
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