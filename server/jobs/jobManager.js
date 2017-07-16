var config = require('../config')
var kue = require('kue')
    , queue = kue.createQueue(config.redis)

queue.on('job enqueue', function(id, type){
    console.log( 'Job %s got queued of type %s', id, type )

})

queue.process('allJobs', function(job, done){
    console.log(job.type)
    setTimeout(function(){ job.log('SOME LOG') }, 3000)
    setTimeout(function(){ job.progress(50,100) }, 5000)
    setTimeout(function(){ done() }, 10000)
})


function getKue() {
    return queue
}

function createJob(jobOptions, cb) {
    var job = queue.create('allJobs', jobOptions).save(function(err){
        if( !err ) cb(null,job.id)
        else cb(err)
    })
}


function setJobPriority(jobId, priority) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.priority(priority)
    })
}


function setJobTTL(jobId, ttl) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.ttl(ttl)
    })
}

function setJobAttempts(jobId, attempts) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.attempts(attempts)
    })
}

function setJobLog(jobId, log) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.log(log)
    })
}

function setJobProgress(jobId, progressPercent ) {
    kue.Job.get(jobId, function(err, job){
        if (err) return
        job.progress(progressPercent, 100)
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