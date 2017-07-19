
function jobErrorHandler(socket, job, done) {
    return function(response) {
        if(job)
            done(new Error(response.error))
        else
            console.log('JobErrorHandling for '+job.id+' failed')
    }

}

module.exports = jobErrorHandler