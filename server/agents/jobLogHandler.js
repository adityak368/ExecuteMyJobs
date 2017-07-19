function jobLogHandler(socket,job) {
    return function(response) {
        if(job)
            job.log(response.log)
        else
            console.log('Joblogging for '+ job.id + ' failed')
    }

}

module.exports = jobLogHandler