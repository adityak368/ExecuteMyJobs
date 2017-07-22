var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var configurationSchema = new Schema({
    name: {  type: String,
        index : true,
        unique : true,
        trim: true,
        required: 'Please Enter a Configuration Name!'},
    description: {  type: String,
        trim: true,
        required: 'Please Enter a Configuration Description!'},
    workingDir: {  type: String,
        trim: true},
    agentFilter : [new Schema({
        k: {
            type: String,
            required: true 
        },
        v: {
            type: String,
            required: true 
        }
    }, { _id : false})],
    buildSteps: [ { type : Schema.ObjectId, ref: 'BuildStep'} ]
},{ timestamps: true })

configurationSchema.pre('remove', function(next) {
    this.model('Project').update(
        { },
        { '$pull': { 'configurations': this._id } },
        { 'multi': true },
        next
    )
})


var Configuration = mongoose.model('Configuration', configurationSchema)

// make this available to our users in our Node applications
module.exports = Configuration