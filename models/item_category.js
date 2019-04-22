var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  item_category    :{type:String}
});

let ItemCategory =module.exports = mongoose.model('item_category',schema);
