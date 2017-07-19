

function statusHandler(socket) {
    return function(response) {
        console.log('Agent Status: '+ response.agent + ' ' + response.isBusy)
        if(!response.isBusy) {
            
        }
    }

}

module.exports = statusHandler