// var nohm = require('nohm').Nohm;
//
// var Project = nohm.model('Project', {
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
//         }
//     }
// });
//
// module.exports  = Project;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var projectSchema = new Schema({
    name: {  type: String,
        index : true,
        unique : true,
        trim: true,
        required: 'Please Enter a Project Name!'},
    description: {  type: String,
                    trim: true,
                    required: 'Please Enter a Project Description!'},

    configurations: [ { type : Schema.ObjectId, ref: 'Configuration'} ]
},{ timestamps: true });


var Project = mongoose.model('Project', projectSchema);

// make this available to our users in our Node applications
module.exports = Project;
