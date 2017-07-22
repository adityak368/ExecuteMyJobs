var Agent = require('../models/Agent')
var agenda = require('../jobs/agenda')

function disconnectionHandlerOnConnect(socket) {
    return function() {
        console.log('Agent '+socket.conn.remoteAddress.replace(/^.*:/, '')+ ' disconnected!')
        Agent.findOne({name: socket.handshake.query.name}, function (err, agent) {
            if (err) {
                socket.emit('exception', err.message)
                return
            }
            if (agent) {
                if (!agent.isAuthorized) {
                    agent.remove(function (err) {
                        if (err) {
                            socket.emit('exception', err.message)
                            return
                        }
                    })
                } else {
                    Agent.update({name: socket.handshake.query.name}, {isConnected : false}, function (err) {
                        if (err) {
                            socket.emit('exception', err.message)
                            return
                        }
                    })
                }
            }
        })
    }

}


function disconnectionHandlerAfterJobStart(job,socket,done) {
    return function() {
        console.log('Agent '+socket.conn.remoteAddress.replace(/^.*:/, '')+ ' disconnected!')
        Agent.findOne({name: socket.handshake.query.name}, function (err, agent) {
            if (err) {
                socket.emit('exception', err.message)
                return
            }
            if (agent) {
                if (!agent.isAuthorized) {
                    agent.remove(function (err) {
                        if (err) {
                            socket.emit('exception', err.message)
                            return
                        }
                    })
                } else {
                    Agent.update({name: socket.handshake.query.name}, {isConnected : false}, function (err) {
                        if (err) {
                            socket.emit('exception', err.message)
                            return
                        }
                    })
                }
            }
        })

        if(job && job.attrs.lockedAt!=null) {
            log(job, 'Agent Disconnected' , function(err) {done(new Error('Agent Disconnected!')) })
        }
        
        agenda.stop(function() {
            agenda.undefine(socket.handshake.query.name)
            agenda.start()
        })
    }

}


function log(job, msg, cb) {
    if(job.attrs.data.log)
        job.attrs.data.log = job.attrs.data.log + msg
    else 
        job.attrs.data.log = msg
    job.save(cb)
}

module.exports = {
    disconnectionHandlerOnConnect : disconnectionHandlerOnConnect,
    disconnectionHandlerAfterJobStart : disconnectionHandlerAfterJobStart
}