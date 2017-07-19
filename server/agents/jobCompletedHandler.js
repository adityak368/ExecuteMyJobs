function jobCompletedHandler(socket, job, done) {
    return function(data) {
        if(job)
            done()
        else
            console.log('JobCompleteHandling for '+data.id+' failed')
    }

}

module.exports = jobCompletedHandler