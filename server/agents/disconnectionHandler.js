var agenda = require('../jobs/agenda')
var Agent = require('../models/Agent')

function disconnectionHandlerOnConnect(socket) {
    return function() {
        ///console.log('Agent '+socket.conn.remoteAddress.replace(/^.*:/, '')+ ' disconnected!')
        console.log('Agent Disconnected ' + socket.handshake.query.name)
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


function disconnectionHandlerAfterJobStart(job,socket,SocketIO,done) {
    return function() {
        //console.log('Agent '+socket.conn.remoteAddress.replace(/^.*:/, '')+ ' disconnected!')
        console.log('Agent Disconnected ' + socket.handshake.query.name)
        Agent.findOne({name: socket.handshake.query.name}, function (err, agent) {
            if (err) {
                console.log(err.message)
            }
            if (agent) {
                if (!agent.isAuthorized) {
                    agent.remove(function (err) {
                        if (err) {
                            console.log(err.message)
                        }
                        cleanupDisconnection(job,socket,SocketIO,done) 
                    })
                } else {
                    Agent.update({name: socket.handshake.query.name}, {isConnected : false}, function (err) {
                        if (err) {
                            console.log(err.message)
                        }
                        cleanupDisconnection(job,socket,SocketIO,done) 
                    })
                }
            } else {
                cleanupDisconnection(job,socket,SocketIO,done) 
            }
        })

        
    }

}

function cleanupDisconnection(job,socket,SocketIO,done) {
    if(job && job.attrs.lockedAt!=null) {
        log(job, 'Agent Disconnected' , function(err) {
            done(new Error('Agent Disconnected!'))
            SocketIO.of('/browser').emit('update', {job : job})
            agenda.stop(function() {
                agenda.undefine(socket.handshake.query.name)
                agenda.start()
            })
        })
    }

    
}

function log(job, msg, cb) {
    var log = {
        timestamp : new Date().toISOString(),
        step : 'Failed',
        log : msg,
        command : 'NA'
    }
    if(!job.attrs.data.log)
        job.attrs.data.log = []
    job.attrs.data.log.push(log)
    job.save(cb)
}

module.exports = {
    disconnectionHandlerOnConnect : disconnectionHandlerOnConnect,
    disconnectionHandlerAfterJobStart : disconnectionHandlerAfterJobStart
}