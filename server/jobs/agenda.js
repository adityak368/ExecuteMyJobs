var Agenda = require('agenda')
var config = require('../config')
var agenda = new Agenda(config.mongo)
agenda.processEvery ('10 seconds')

agenda.on('ready', function() {
    console.log('Agenda Connected to MongoDB')
    agenda.start()
})

agenda.on('start', function(job) {
    console.log('Job %s with id %s starting on %s', job.attrs.data.type, job.attrs._id, job.attrs.data.agent)
})

agenda.undefine = function(name) {
    if(agenda._definitions.hasOwnProperty(name))
        delete agenda._definitions[name]
}

agenda.defaultConcurrency(1)

module.exports = agenda