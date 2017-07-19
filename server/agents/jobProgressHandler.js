function jobProgressHandler(socket, job) {
    return function(response) {
        if(job)
            job.progress(response.progress,100)
        else
            console.log('JobProgress Update for '+ job.id + ' failed')
    }

}

module.exports = jobProgressHandler