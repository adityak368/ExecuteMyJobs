function jobErrorHandler(job,socket,done) {
    return function(response) {
        done(new Error('Job Failed At Agent'))
    }
}


module.exports = jobErrorHandler