var Agent = require('../models/Agent')

function disconnectionHandler(socket) {
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

module.exports = disconnectionHandler