var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
  done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function (err,user) {
    done(err,user);
  });
});

// // sign in
passport.use('local.signin', new LocalStrategy({
  usernameField:'email',
  passwordField: 'password',
  passReqToCallback:true
},function (req,email,password,done) {
  req.checkBody('email','Invalid email').notEmpty().isEmail();
  req.checkBody('password','Invalid password').notEmpty();
  var errors = req.validationErrors();
  if(errors){

    var messages = [];

    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null,false,req.flash('error',messages));
  }
  User.findOne({'email':email},function (err,user) {
    if(err){

      return done(err);
    }
    if(!user){
      return done(null,false,req.flash('danger','No user found.'));
    }
    if (!user.validPassword(password)) {
        return done(null,false,req.flash('danger','wrong password.'));
    }
    return done(null,user);
  });
}));
