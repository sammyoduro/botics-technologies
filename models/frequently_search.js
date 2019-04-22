var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  item           :{type:String,required:true},
  timestamp      :{type:String}
});

let Product =module.exports = mongoose.model('frequently_search',schema);
