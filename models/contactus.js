var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  fullname :{type:String},
  email    :{type:String},
  message  :{type:String},
  read     :{type:Boolean},
  timestamp:{type:String}
});

let Contactus =module.exports = mongoose.model('contactus',schema);
