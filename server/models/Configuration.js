// var nohm = require('nohm').Nohm;
//
// var Configuration = nohm.model('Configuration', {
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
//     }
// });
//
// module.exports  = Configuration;



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    buildSteps: [ { type : Schema.ObjectId, ref: 'BuildStep'} ]
},{ timestamps: true });


var Configuration = mongoose.model('Configuration', configurationSchema);

// make this available to our users in our Node applications
module.exports = Configuration;