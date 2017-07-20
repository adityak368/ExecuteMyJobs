var agenda = require('./agenda')

function createJob(jobOptions, cb) {
    var job = agenda.create(jobOptions.agent,jobOptions )
    job.save(function(err) {
        if( !err ) cb(null,job.attrs._id)
        else cb(err)
    })
}

module.exports = {
    createJob : createJob,
}