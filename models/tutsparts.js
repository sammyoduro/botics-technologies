var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  original_id    :{type:String,required:true},
  short_desc     :{type:String,required:true},
  overview       :{type:String,required:true},
  instructions   :{type:String,required:true},
  materials      :{type:String},
  videoImg_url   :{type:String,required:true},
  video_url      :{type:String,required:true},
  timestamp      :{type:String,required:true}
});

let Tuts_parts =module.exports = mongoose.model('tuts_parts',schema);
