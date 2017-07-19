var queue = require('../jobs/jobQueue').getQueue()
var JobProcessor = require('../jobs/jobProcessor')

function statusHandler(socket) {
    return function(response) {
        console.log('Agent Status: '+ response.job.data.agent + ' ' + response.isBusy)
        if(!response.isBusy) {
            queue.process(response.job.data.agent, JobProcessor.getJobProcessor())
        }
    }

}

module.exports = statusHandler