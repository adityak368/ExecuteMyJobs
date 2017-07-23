var Agenda = require('agenda')
var config = require('../config')
var Agent = require('../models/Agent')
var fs = require('fs')

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

function shutDownAgenda(err) {
    if(err) {
        console.log(err)
        var logErrorToFile=fs.createWriteStream(__dirname + '/error.log',{flags:'a'}) 
        logErrorToFile.write('Caught exception: '+ err.message + '\n' + err.stack)
        logErrorToFile.close()
    }
    agenda.stop(function() {
        
        Agent.update({isAuthorized : true}, {$set: {isConnected : false}}, {'multi': true}, function (err) {
            if (err) {
                process.exit(1)
            }
            Agent.remove({isAuthorized : false}, function (err) {
                if (err) {
                    process.exit(1)
                }
                process.exit(0)
            })
        })
    })
}

process.on('uncaughtException', shutDownAgenda)
process.on('SIGTERM', shutDownAgenda)
process.on('SIGINT' , shutDownAgenda)

module.exports = agenda