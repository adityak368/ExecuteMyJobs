var Agent = require('../models/Agent')
var defineAgentProcessor = require('../jobs/jobManager').defineAgentProcessor

function handleIdentification(socket, SocketIO) {
    return function(connectedAgent) {
        connectedAgent.ipAddress = socket.conn.remoteAddress.replace(/^.*:/, '')
        connectedAgent.isConnected = true
        Agent.findOne({name: connectedAgent.name}, function (err, registeredAgent) {
            if (err) {
                socket.emit('exception', err.message)
                return
            }
            if (!registeredAgent) {
                var newAgent = new Agent(connectedAgent)
                console.log(newAgent)
                newAgent.save(function (err) {
                    if (err) {
                        console.log(err)
                        socket.emit('exception', err.message)
                        return
                    }
                    defineAgentProcessor(socket, SocketIO)
                })
            } else {
                if (registeredAgent.isConnected) {
                    socket.emit('exception', 'Agent by that name already exists!')
                    return
                } else {
                    Agent.update({name: connectedAgent.name},{isConnected : true}, function (err) {
                        if (err) {
                            socket.emit('exception', err.message)
                            return
                        }
                        defineAgentProcessor(socket, SocketIO)
                    })
                }
            }
        })
    }

}

module.exports = handleIdentification