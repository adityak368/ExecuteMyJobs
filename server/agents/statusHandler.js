function statusHandler(job,socket) {
    return function (response) {
        console.log('Agent Status: '+ response.agent + ' ' + response.isBusy)
        if(!response.isBusy) {
            socket.emit('startjob', job)  
            //job.log('Agent Found. Started Job...')   
            console.log('Agent Found. Started Job...')
        } else {
            console.log('Agent Busy. Please Wait')
        }
    }
}

module.exports = statusHandler