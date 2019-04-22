var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  userid:{type:String,required:true},
  proposal_topic:{type:String,required:true},
  fullname:{type:String,required:true},
  email:{type:String,required:true},
  phone_num:{type:String,required:true},
  description:{type:String,required:true},
  filePath:{type:String,required:true},
  docStatus:{type:String},
  viewed_timestamp:{type:String,required:true},
  inprogress_timestamp:{type:String,required:true},
  completed_timestamp:{type:String,required:true},
  timestamp:{type:String,required:true},
});

module.exports = mongoose.model('Proposal',schema);
