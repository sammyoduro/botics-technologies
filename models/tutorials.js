var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  short_desc     :{type:String,required:true},
  overview       :{type:String,required:true},
  instructions   :{type:String,required:true},
  materials      :{type:String},
  videoImg_url   :{type:String,required:true},
  video_url      :{type:String,required:true},
  timestamp      :{type:String,required:true}
});

let Tutorials =module.exports = mongoose.model('tutorials',schema);
