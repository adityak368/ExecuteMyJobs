var config = require('../config')
var kue = require('kue')
    , queue = kue.createQueue(config.redis)
var io = require('../agentSocketManager')

//agent job handlers
var jobLogHandler = require('../agents/jobLogHandler')
var jobProgressHandler = require('../agents/jobProgressHandler')
var jobCompletedHandler = require('../agents/jobCompletedHandler')
var jobErrorHandler = require('../agents/jobErrorHandler')
var statusHandler = require('../agents/statusHandler')

queue.on('job enqueue', function(id, type){
    console.log( 'Job %s got queued of type %s', id, type )
})

function getKue() {
    return queue
}

function jobProcessor(jobOptions){
    return function(job,done) {
        job.log('Job '+job.type+' to be run on ' + jobOptions.agent + ' is waiting for the agent')

        //configure job event handlers for socket
        if(io.getio().sockets.adapter.rooms[jobOptions.agent]) {
            var clientSockets = io.getio().sockets.adapter.rooms[jobOptions.agent].sockets
            Object.keys(clientSockets).forEach(function(socketId) {
                var socket = io.getio().sockets.sockets[socketId]
                if(socket) {
                    socket.on('joblog', jobLogHandler(socket, job))
                    socket.on('jobprogress', jobProgressHandler(socket, job))
                    socket.on('jobcompleted', jobCompletedHandler(socket, job,done))
                    socket.on('joberror', jobErrorHandler(socket, job, done))
                    socket.on('status', statusHandler(socket, job, jobOptions))
                } else {
                    console.log('Could Not Connect to agent '+jobOptions.agent+'. Socket not found')
                    return
                }
            })
            
            io.getio().sockets.in(jobOptions.agent).emit('status', job)
            job.log('Waiting for agent to be available...')
        }
    }
}

function createJob(jobOptions, cb) {
    var job = queue.create(jobOptions.agent, jobOptions).save(function(err){
        if( !err ) cb(null,job.id)
        else cb(err)
    })

    queue.process(jobOptions.agent, jobProcessor(jobOptions))

}


function setJobPriority(jobId, priority) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.priority(priority).update()
    })
}


function setJobTTL(jobId, ttl) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.ttl(ttl).update()
    })
}

function setJobAttempts(jobId, attempts) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.attempts(attempts).update()
    })
}

function setJobLog(jobId, log) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.log(log).update()
    })
}

function setJobProgress(jobId, progressPercent ) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.progress(progressPercent, 100).update()
    })
}

module.exports = {
    getKue  :  getKue,
    createJob : createJob,
    setJobPriority : setJobPriority,
    setJobTTL : setJobTTL,
    setJobAttempts : setJobAttempts,
    setJobLog : setJobLog,
    setJobProgress : setJobProgress
}