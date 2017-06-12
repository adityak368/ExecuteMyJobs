var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var db = require('./db');

var api = require('./routes/api');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '../client', 'bower_components')));

app.use('/api', api);
app.use('*', routes);

db.connect( config.dbUrl, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// var kue = require('./jobs/kue');
//
// var job = kue.getKue().create('video conversion', {
//     title: 'converting loki\'s to avi'
//     , user: 1
//     , frames: 200
// });
//
// job.on('complete', function(result){
//     console.log('Job completed with data ', result);
//
// }).on('failed attempt', function(errorMessage, doneAttempts){
//     console.log('Job failed');
//
// }).on('failed', function(errorMessage){
//     console.log('Job failed');
//
// }).on('progress', function(progress, data){
//     console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
//
// });
module.exports = app;
