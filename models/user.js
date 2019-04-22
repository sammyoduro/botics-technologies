var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  userType    :{type:String},
  firstname   :{type:String,required:true},
  lastname    :{type:String,required:true},
  phone_num   :{type:String,required:true},
  Otherphone_num :{type:String},
  email       :{type:String,required:true},
  password    :{type:String,required:true}
});
userSchema.methods.encryptPassword= function (password) {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('User',userSchema);
