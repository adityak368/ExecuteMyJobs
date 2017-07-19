function jobLogHandler(socket,job) {
    return function(data) {
        if(job)
            job.log(data.log)
        else
            console.log('Joblogging for '+ data.id + ' failed')
    }

}

module.exports = jobLogHandler