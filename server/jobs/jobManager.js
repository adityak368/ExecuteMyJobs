var agenda = require('./agenda')
var jobLogHandler = require('../agents/jobLogHandler')
var jobProgressHandler = require('../agents/jobProgressHandler')
var jobCompletedHandler = require('../agents/jobCompletedHandler')
var jobErrorHandler = require('../agents/jobErrorHandler')
var statusHandler = require('../agents/statusHandler')
var disconnectionHandler = require('../agents/disconnectionHandler')

function defineAgentProcessor(socket,SocketIO) {
    agenda.define(socket.handshake.query.name, function(job,done) {
        console.log('Processing Job ' + job.attrs._id)
        SocketIO.of('/browser').emit('update', {job : job})
        socket.removeAllListeners()
        job.attrs.data.log = ''
        job.attrs.data.progress = 0
        job.save()
        socket.on('disconnect', disconnectionHandler.disconnectionHandlerAfterJobStart(job,socket,SocketIO,done))
        socket.on('joblog', jobLogHandler(job,socket,SocketIO))
        socket.on('jobprogress', jobProgressHandler(job,socket,SocketIO) )
        socket.on('jobcompleted',jobCompletedHandler(job,socket,SocketIO,done) )
        socket.on('joberror', jobErrorHandler(job,socket,SocketIO,done))
        socket.on('status', statusHandler(job,socket))
        
        socket.emit('status', job)  
        console.log('Checking Agent Availability')
    })
}

function createJob(jobOptions, cb) {
    var job = agenda.create(jobOptions.agent,jobOptions )
    job.save(function(err) {
        if( !err ) cb(null,job.attrs._id)
        else cb(err)
    })
}

module.exports = {
    createJob : createJob,
    defineAgentProcessor : defineAgentProcessor
}