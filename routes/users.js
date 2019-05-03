var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');
const moment = require('moment');



var csrfProtection = csrf();
router.use(csrfProtection);

/* GET users listing. */
router.get('/register', function(req,res) {
  let inputs ={}
  var messages = req.flash('error');

  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,inputs:inputs,});
});
router.post('/register',function (req,res) {
var fname = req.body.fname;
var lname = req.body.lname;
var pnumber = req.body.pnumber;
var opnumber = req.body.opnumber;
var email = req.body.email;
var password = req.body.password;
var rpassword = req.body.rpassword;
// var illegalChars = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
var illegalChars = /^\d{10}$/;
var fnameValidationErr   = "";
var lnameValidationErr    = "";
var pnumberValidationErr       = "";
var opnumberValidationErr       = "";
var emailValidationErr      = "";
var passwordValidationErr      = "";
let inputs ={fname,lname,pnumber,opnumber,email}
req.checkBody('fname','firstname is required').notEmpty();
req.checkBody('lname','lastname is required').notEmpty();
req.checkBody('pnumber','phone number is required').notEmpty();
req.checkBody('email','please enter a valid email').notEmpty().isEmail();
req.checkBody('password','password must be atleast 8 characters and not empty').notEmpty().isLength({min:8});

if(password != rpassword){
    passwordValidationErr = "password do not match";
  }
  let errors = req.validationErrors();


  if(errors){
  for(var i=0; i<errors.length;i++){
    if( errors[i].msg === 'firstname is required'){fnameValidationErr = 'firstname is required';}
    if( errors[i].msg === 'lastname is required'){lnameValidationErr = 'lastname is required';}
    if( errors[i].msg === 'phone number is required'){pnumberValidationErr = 'phone number is required';}
    if( errors[i].msg === 'please enter a valid email'){emailValidationErr = 'please enter a valid email';}
    if( errors[i].msg === 'password must be atleast 8 characters and not empty'){passwordValidationErr = 'password must be atleast 8 characters and not empty';}
  }
}
var check = illegalChars.test(pnumber);
if (check == false) {pnumberValidationErr = 'phone number is not valid';}

User.findOne({'email':email},function (err,user) {
  if(err){
      throw err;
    }
    if(fnameValidationErr != '' || lnameValidationErr != '' || pnumberValidationErr != '' || emailValidationErr != '' || passwordValidationErr != ''){
      res.render('user/signup',{
        csrfToken:req.csrfToken(),
        inputs:inputs,
        fnameValidationErr :fnameValidationErr,
        lnameValidationErr :lnameValidationErr,
        pnumberValidationErr :pnumberValidationErr,
        emailValidationErr :emailValidationErr,
        passwordValidationErr:passwordValidationErr,
      });
    }else if ( user ) {
      res.render('user/signup',{
        csrfToken:req.csrfToken(),
        inputs:inputs,
        emailValidationErr :'Email is already in use',
      });
    }
    else{
      var hashpwrd =  bcrypt.hashSync(password,bcrypt.genSaltSync(8));
      console.log("User password: "+password);
      var user = new User({
        firstname:fname,
        lastname:lname,
        phone_num:pnumber,
        Otherphone_num:opnumber,
        email:email,
        password:hashpwrd
      });

      user.save(function (err,results) {
        if(err){
          throw err;
        }

        if (req.session.oldUrl) {

          res.redirect('/pages/store-front'+req.session.oldUrl);
          req.session.oldUrl = null;
        }else{
          req.flash('success','User saved successfully');
          res.redirect('/users/login');
        }

      });

    }

  });

});

router.get('/login', function(req,res) {

  req.flash('info',req.session.oldUrl_pass);
  req.session.oldUrl_pass = null;
  res.render('user/signin',{
    csrfToken:req.csrfToken(),
    user:req.user
  });
});

router.post('/login', passport.authenticate('local.signin',{
  failureRedirect: '/users/login',
  failureFlash   : true
}
),function (req,res,next) {
  if (req.session.oldUrl) {
    res.redirect('/pages/store-front'+req.session.oldUrl);
    req.session.oldUrl = null;
  }else{
    res.redirect('/');
  }
});



router.get('/logout',function (req,res) {
  req.logout();
  res.redirect('/');
});

router.get('/dashboard',isLoggedIn, function(req, res) {
  Order.find({user: req.user})
    .sort({_id:-1})
    .exec(function(err, orders) {
  // Order.find({user: req.user},function (err,orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/dashboard',{
      user:req.user,
      orders:orders,
      moment:moment
    });
  });

})
// user settings
router.get('/settings',isLoggedIn, function(req, res) {

    res.render('user/settings',{
      user:req.user,
      csrfToken:req.csrfToken(),
  });
})
router.post('/settings',isLoggedIn, function(req, res) {

var cpword = req.body.cpword;
var pword = req.body.pword;
var rpword = req.body.rpword;
var emptyfield   = "";
var pword_err   = "";
var rpword_err = "";

req.checkBody('cpword','all fields are required').notEmpty();
req.checkBody('pword','all fields are required').notEmpty();
req.checkBody('rpword','all fields are required').notEmpty();
req.checkBody('pword','password must be atleast 8 characters').isLength({min:8});

let errors = req.validationErrors();
if(errors){
for(var i=0; i<errors.length;i++){
  if( errors[i].msg === 'all fields are required'){ emptyfield = errors[i].msg}
  if( errors[i].msg === 'password must be atleast 8 characters'){ pword_err = errors[i].msg}
}
}
if (pword != rpword) {
  rpword_err = "passwords do not match";
}

if (emptyfield != "" || pword_err != "" || rpword_err != "") {
  req.flash('danger',emptyfield || pword_err || rpword_err);
    res.render('user/settings',{
      user:req.user,
      csrfToken:req.csrfToken(),
  });

}else{

  User.findOne({'_id':req.user.id},function (err,user) {

    bcrypt.compare(cpword,user.password,function(err,isMatch) {
      if(err) throw err;

      if(isMatch){
        var hash = bcrypt.hashSync(pword,bcrypt.genSaltSync(8));
        User.update({'_id':req.user.id}, {$set: {password : hash}}, function(err, result){
          if (err) {
            throw err
          }
          req.flash('success','password changed successfully');
          res.render('user/settings',{
            user:req.user,
            csrfToken:req.csrfToken(),
        });

        });
      }else{
        req.flash('danger','wrong password');
        res.render('user/settings',{
          user:req.user,
          csrfToken:req.csrfToken(),
      });

      }


    });

  })

}
// req.checkBody('email','please enter a valid email').notEmpty().isEmail();
// req.checkBody('password','password must be atleast 8 characters and not empty').notEmpty().isLength({min:8});

// req.flash('danger','User saved successfully');

})
module.exports = router;


function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notisLoggedIn(req,res,next) {
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
