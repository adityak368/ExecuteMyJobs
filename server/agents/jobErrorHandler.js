function jobErrorHandler(job,socket,SocketIO,done) {
    return function(response) {
        done(new Error('Job Failed At Agent'))
        SocketIO.of('/browser').emit('update', job)
    }
}


module.exports = jobErrorHandler