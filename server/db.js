var mongoose = require('mongoose')

var db = mongoose.connection

function connect(url, cb) {
    mongoose.Promise = global.Promise
    mongoose.connect(url)
    db.on('error', cb)
    db.once('open', function() {
        console.log('Connected To MongoDB')
        cb()
    })
};

function getDB (){
    return db
};

module.exports = {
    connect : connect,
    getDB : getDB
}