var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

},{ timestamps: true });


var BuildStep = mongoose.model('BuildStep', buildStepSchema);

buildStepSchema.pre('remove', function(callback) {
    // Remove all the docs that refers
    var buildStep = this;
    this.model('Configuration').update(
        { $pull: { buildSteps : buildStep } },
        { multi: true }, callback);
});

// make this available to our users in our Node applications
module.exports = BuildStep;