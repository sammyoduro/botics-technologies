var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title     :{type:String,required:true},
  video_img_url      :{type:String,required:true},
  video_url      :{type:String,required:true},
  timestamp      :{type:String,required:true}
});

let featured =module.exports = mongoose.model('featured_vid',schema);
