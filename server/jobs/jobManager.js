var agenda = require('./agenda')
var SocketIO = require('../agentSocketManager')

function createJob(jobOptions, cb) {
    var job = agenda.create(jobOptions.type,jobOptions )
    job.save(function(err) {
        if( !err ) cb(null,job.attrs._id)
        else cb(err)
    })
}

agenda.define('Test2 Config', function(job,done) {
    console.log('Processing Job ' + job.attrs._id)
    var clients = SocketIO.getio().sockets.adapter.rooms[job.attrs.data.agent].sockets
    var socket = SocketIO.getio().sockets.sockets[Object.keys(clients)[0]]
    
    if(socket._events.jobcompleted)
        delete socket._events.jobcompleted
    console.log(socket._events)
    if(!socket._events.joblog)
        socket.on('joblog', function(response) {
            //job.log(response.log)
            console.log(response.log)
            console.log(job.attrs._id)
        })

    if(!socket._events.jobprogress)
        socket.on('jobprogress',  function(response) {
            //job.progress(response.progress,100)
            console.log(response.progress)
        })
    
    if(!socket._events.jobcompleted)
        socket.on('jobcompleted', function(response) {
            done()
        })

    if(!socket._events.joberror)
        socket.on('joberror', function(response) {
            done(new Error(response.error))
        })

    if(!socket._events.status)
        socket.on('status',function(response) {
            console.log('Agent Status: '+ response.agent + ' ' + response.isBusy)
            if(!response.isBusy) {
                socket.emit('startjob', job)  
                //job.log('Agent Found. Started Job...')   
                console.log('Agent Found. Started Job...')
            } else {
                console.log('Agent Busy. Please Wait')
            }
        })
        
    socket.emit('status', job)  
    console.log('Checking Agent Availability')
})

module.exports = {
    createJob : createJob,
}