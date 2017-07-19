
function jobErrorHandler(socket, job, done) {
    return function(data) {
        if(job)
            done(new Error(data.error))
        else
            console.log('JobErrorHandling for '+data.id+' failed')
    }

}

module.exports = jobErrorHandler