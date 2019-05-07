var express       = require('express');
var router        = express.Router();
var dateFormat    = require('dateformat');
const randomstring= require('randomstring');
var passport = require('passport');
var csrf          = require('csurf');
var bcrypt        = require('bcrypt-nodejs');
var Admin          = require('../models/user');


var csrfProtection = csrf();


router.use(csrfProtection);

/* GET home page. */
// ====================
//    admin login
// ====================
router.get('/', function(req, res) {
  res.render('admin/login',{csrfToken:req.csrfToken()});

});


router.post('/',function (req,res,next) {

  passport.authenticate('local.signin',function (err,user,info) {
    if (err) throw err;
    if(!user){
      req.flash("danger","incorrect username or password");
      res.redirect('/areacode97/admin/outofbound');
    }else{


      if (user.userType) {
        req.login(user,function (error) {
          if(error) return next(error);
          res.redirect('/areacode97/admin/outofbound/admin/proposals');

        });
      }else{
        res.redirect('/')
      }

    }
  //

  })(req, res, next);
});

module.exports = router;
