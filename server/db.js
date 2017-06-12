// var nohm = require('nohm').Nohm;
// var redis = require('redis');
//
// function connect (port, host, cb) {
//     var client = redis.createClient(port, host);
//     client.on('connect', function () {
//         nohm.setClient(client);
//         nohm.setPrefix('ExecuteMyJobs');
//         console.log('Connected To Redis');
//         cb();
//     })
//
//     client.on("error", cb);
// };
//
// function getDB() {
//     return nohm;
// }
//
//
// module.exports = {
//     connect : connect,
//     getDB : getDB
// };

var mongoose = require('mongoose');

var db = mongoose.connection;

function connect(url, cb) {
    mongoose.Promise = global.Promise;
    mongoose.connect(url);
    db.on('error', cb);
    db.once('open', function() {
        console.log('Connected To MongoDB');
        cb();
    });
};

function getDB (){
    return db;
};

module.exports = {
    connect : connect,
    getDB : getDB
};