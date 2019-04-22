var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  trans_ref_no: {type: String, required: true},
  order_id: {type: String, required: true},
  delivered:{type: String},
  timestamp:{type:String, required: true}
});

module.exports = mongoose.model('Order',schema);
