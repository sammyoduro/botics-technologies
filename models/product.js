var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  item_category    :{type:String},
  imagePath_one    :{type:String},
  imagePath_two    :{type:String},
  imagePath_three  :{type:String},
  imagePath_four   :{type:String},
  title            :{type:String,required:true},
  description      :{type:String,required:true},
  detailed_description:{type:String,required:true},
  price            :{type:String,required:true},
  quantities       :{type:String,required:true},
  orders           :{type:Number},
  feedback         :{type:String}
});

let Product =module.exports = mongoose.model('product',schema);
