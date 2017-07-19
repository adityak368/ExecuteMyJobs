var config = require('../config')
var kue = require('kue')
    , queue = kue.createQueue(config.redis)

    
queue.on('job enqueue', function(id, type){
    console.log( 'Job %s got queued of type %s', id, type )
})

function getQueue() {
    return queue
}

module.exports = {
    getQueue  :  getQueue,
}