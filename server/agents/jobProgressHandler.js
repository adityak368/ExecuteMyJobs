function jobProgressHandler(socket, job) {
    return function(data) {
        if(job)
            job.progress(data.progress,100)
        else
            console.log('JobProgress Update for '+ data.id + ' failed')
    }

}

module.exports = jobProgressHandler