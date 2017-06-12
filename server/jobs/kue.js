var config = require('../config');
var queue = require('kue').createQueue(config.redis);

function getKue() {
    return queue;
}

module.exports = {
    getKue  :  getKue
};