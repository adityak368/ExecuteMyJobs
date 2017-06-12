var Agent = require('../models/Agent');

function handleIdentification(socket) {
    return function(connectedAgent) {
        connectedAgent.ipAddress = socket.conn.remoteAddress.replace(/^.*:/, '');
        connectedAgent.isConnected = true;
        Agent.findOne({name: connectedAgent.name}, function (err, registeredAgent) {
            if (err) {
                socket.emit('exception', err.message);
                return;
            }
            if (!registeredAgent) {
                var newAgent = new Agent(connectedAgent);
                console.log(newAgent);
                newAgent.save(function (err) {
                    if (err) {
                        console.log(err);
                        socket.emit('exception', err.message);
                        return;
                    }
                });
            } else {
                if (registeredAgent.isConnected) {
                    socket.emit('exception', 'Agent by that name already exists!');
                    return;
                } else {
                    registeredAgent.isConnected = true;
                    registeredAgent.save(function (err) {
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

module.exports = handleIdentification;