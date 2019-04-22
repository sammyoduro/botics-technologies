var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  fullname: {type: String, required: true},
  email: {type: String, required: true},
  phone_num: {type: String, required: true},
  payment_description: {type: String, required: true},
  amount: {type: String, required: true},
  trans_ref_no: {type: String, required: true},
  payment_id: {type: String, required: true},
  timestamp:{type:String, required: true}
});

module.exports = mongoose.model('Services',schema);
