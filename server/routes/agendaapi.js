var express = require('express')
var router = express.Router()
var agenda = require('../jobs/agenda')
var mongoose = require('mongoose')

function getJobs (jobid, state, callback) {
    var preMatch = {}
    if (jobid) preMatch._id = mongoose.Types.ObjectId(jobid)

    var postMatch = {}
    if (state) postMatch[state] = true

    var limit = 200 // todo UI param
    var skip = 0 // todo UI param
    agenda._collection.aggregate([
        {$match: preMatch},
        {$sort: {
            nextRunAt: -1,
            lastRunAt: -1,
            lastFinishedAt: -1
        }},
        {$project: {
            _id: 0,
            job: '$$ROOT',
            nextRunAt: {$ifNull: ['$nextRunAt', 0]},
            lockedAt: {$ifNull: ['$lockedAt', 0]},
            lastRunAt: {$ifNull: ['$lastRunAt', 0]},
            lastFinishedAt: {$ifNull: ['$lastFinishedAt', 0]},
            failedAt: {$ifNull: ['$failedAt', 0]},
            repeatInterval: {$ifNull: ['$repeatInterval', 0]}
        }},
        {$project: {
            job: '$job',
            _id: '$job._id',
            running: {$and: [
                '$lastRunAt',
                {$gt: [ '$lastRunAt', '$lastFinishedAt' ]}
            ]},
            scheduled: {$and: [
                '$nextRunAt',
                {$gte: [ '$nextRunAt', new Date() ]}
            ]},
            queued: {$and: [
                '$nextRunAt',
                {$gte: [ new Date(), '$nextRunAt' ]},
                {$gte: [ '$nextRunAt', '$lastFinishedAt' ]}
            ]},
            completed: {$and: [
                '$lastFinishedAt',
                {$gt: ['$lastFinishedAt', '$failedAt']}
            ]},
            failed: {$and: [
                '$lastFinishedAt',
                '$failedAt',
                {$eq: ['$lastFinishedAt', '$failedAt']}
            ]},
            repeating: {$and: [
                '$repeatInterval',
                {$ne: ['$repeatInterval', null]}
            ]}
        }},
        {$match: postMatch},
        {$limit: limit},
        {$skip: skip}
    ]).toArray(function (err, results) {
        if (err) return callback(err)
        callback(null, results)
    })
}

router.route('/api').get(function(req, res) {

    getJobs(req.query.jobid, req.query.state, function (err, apiResponse) {
        if (err) return res.status(400).json(err)
        res.json(apiResponse)
    })

})

module.exports = router