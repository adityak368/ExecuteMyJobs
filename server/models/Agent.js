// var nohm = require('nohm').Nohm;
//
// var Agent = nohm.model('Agent', {
//     properties: {
//         name: {
//             type: 'string',
//             unique: true,
//             validations: [
//                 ['notEmpty']
//             ]
//         },
//         description: {
//             type: 'string',
//             validations: [
//                 ['notEmpty']
//             ]
//         },
//         details: {
//             type: 'string',
//             validations: [
//                 ['notEmpty']
//             ]
//         },
//     }
// });
//
// module.exports  = Agent;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var agentSchema = new Schema({
    name: {  type: String,
        index : true,
        unique : true,
        trim: true,
        required: 'Please Enter a Agent Name!'},
    description: {  type: String,
        trim: true,
        required: 'Please Enter a Agent Description!'},
    isAuthorized : {
        type : Boolean,
        default : false
    },
    isEnabled : {
        type : Boolean,
        default: true
    },
    isConnected : {
        type : Boolean,
        default: false
    },
    ipAddress : {  type: String,
        unique : true,
        trim: true,
        required: 'Please Enter a Valid Ip!'},
    os : {  type: String,
        trim: true,
        required: 'Please Enter a Valid Os!'},
    version : {  type: String,
        trim: true,
        required: 'Please Enter a Valid Agent Version!'},
    env : Object,
    attributes : Object

},{ timestamps: true });


var Agent = mongoose.model('Agent', agentSchema);

// make this available to our users in our Node applications
module.exports = Agent;