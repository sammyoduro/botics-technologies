var express = require('express');
var router = express.Router();
var contactus = require('../models/contactus');
var dateFormat          = require('dateformat');


/* GET users listing. */
router.post('/', function(req,res) {
  let username = req.body.username;
  let email = req.body.email;
  let msg = req.body.msg;


  var Contactus = new contactus({
    fullname :username,
    email    :email,
    message  :msg,
    read     : 0,
    timestamp:dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")

  });
  Contactus.save(function (err) {
    if(err){
      throw err;
    }
    res.send({status:'sent'})
  })

});

module.exports = router;
