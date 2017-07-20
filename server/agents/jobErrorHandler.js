function jobErrorHandler(job,socket) {
    return function(response) {
        done(new Error(response.error))
    }
}

module.exports = jobErrorHandler