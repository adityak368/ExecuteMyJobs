var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var buildStepSchema = new Schema({
    name: {  type: String,
        index : true,
        trim: true},
    description: {  type: String,
        trim: true},
    command : {  type: String,
        trim: true},
    commandDir : {
        type: String,
        trim: true,
    },
    arguments : {  type: String,
        trim: true},

},{ timestamps: true })

buildStepSchema.pre('remove', function(next) {
    this.model('Configuration').update(
        { },
        { '$pull': { 'buildSteps': this._id } },
        { 'multi': true },
        next
    )
})

var BuildStep = mongoose.model('BuildStep', buildStepSchema)

// make this available to our users in our Node applications
module.exports = BuildStep