var queue = require('./jobQueue').getQueue()
var io = require('../agentSocketManager')

function createJob(jobOptions, cb) {
    var job = queue.create(jobOptions.agent, jobOptions).save(function(err){
        if( !err ) cb(null,job.id)
        else cb(err)
    })

    job.log('Job '+job.type+' to be run on ' + job.data.agent + ' is waiting for the agent')

    if(io.getio().sockets.adapter.rooms[job.data.agent]) {            
        io.getio().sockets.in(job.data.agent).emit('status', job)
    }
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
    createJob : createJob,
    setJobPriority : setJobPriority,
    setJobTTL : setJobTTL,
    setJobAttempts : setJobAttempts,
    setJobLog : setJobLog,
    setJobProgress : setJobProgress
}