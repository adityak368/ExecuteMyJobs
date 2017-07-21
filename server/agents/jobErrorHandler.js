function jobErrorHandler(job,socket) {
    return function(response) {
        done(new Error(response))
    }
}

module.exports = jobErrorHandler