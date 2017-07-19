module.exports = {
    dbUrl : 'mongodb://127.0.0.1:27017/ExecuteMyJobs',
    redis: {
        port: 6379,
        host: 'localhost',
        auth: ''
    },
    socketIoAuthPassword : 'ExecuteMyJobsAgent',
    mongo : {db: { address: 'mongodb://127.0.0.1:27017/ExecuteMyJobs', collection: 'agendaJobs' }}
}
