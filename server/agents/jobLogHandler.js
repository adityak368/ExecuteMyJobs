function jobLogHandler(job,socket) {
    return function(response) {
        log(job,response.log)
    }
}

function log(job, msg) {
    if(job.attrs.data.log)
        job.attrs.data.log = job.attrs.data.log + '\n' + msg
    else 
        job.attrs.data.log = msg
    job.save()
}

module.exports = jobLogHandler