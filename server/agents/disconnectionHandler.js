var Agent = require('../models/Agent');

function disconnectionHandler(socket) {
    return function() {
        console.log('Agent '+socket.conn.remoteAddress.replace(/^.*:/, '')+ ' diconnected!')
        Agent.findOne({ipAddress: socket.conn.remoteAddress.replace(/^.*:/, '')}, function (err, agent) {
            if (err) {
                socket.emit('exception', err.message);
                return;
            }
            if (agent) {
                if (!agent.isAuthorized && agent.ipAddress===socket.conn.remoteAddress) {
                    agent.remove(function (err) {
                        if (err) {
                            socket.emit('exception', err.message);
                            return;
                        }
                    });
                } else {
                    agent.isConnected = false;
                    agent.save(function (err) {
                        if (err) {
                            socket.emit('exception', err.message);
                            return;
                        }
                    });
                }
            }
        });
    }

}

module.exports = disconnectionHandler;