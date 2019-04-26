const express           = require('express');
const router            = express.Router();
const path              = require('path');
var Product = require('../models/product');
var proposal            = require('../models/proposal');
var tutorials            = require('../models/tutorials');
var fs                  = require('fs');
var nodemailer          = require('nodemailer');
var dateFormat          = require('dateformat');
var FeaturedVideo      = require('../models/featured_videos');
var Services           = require('../models/services');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.aggregate([{ $sample: { size: 3 } }],function (err,product) {
        if(err){throw err;}
// req.flash('success','wow! it finally worked');
                  res.render('default/index', {
                     user:req.user,
                     product : product,
                   });

              });
        })


        // process proposal submission
    router.post('/',function (req,res) {
          var proposal_topic = req.body.proposal_topic;
        var fullname = req.body.fullname;
        var email = req.body.email;
        var phone_num = req.body.phone_num;
        var descriptopn = req.body.descriptopn;
        var proposal_file = req.body.myfile;
        var myFile = req.files.proposal_file;
        var messages = '';
        var ck='';
        var x = genId();
        var prefix = genPrefix();

        var inputFields = {proposal_topic:proposal_topic,fullname:fullname,email:email,phone_num:phone_num,descriptopn:descriptopn,proposal_file:proposal_file,myFile:myFile}

        req.checkBody('proposal_topic','topic is required').notEmpty();
        req.checkBody('fullname','fullname is required').notEmpty();
        req.checkBody('email','invalid email').notEmpty().isEmail();
        req.checkBody('phone_num','phone number is required').notEmpty();
        req.checkBody('descriptopn','Description must not be empty').notEmpty();

        var proposal_topic_errMsg,fullname_errMsg,email_errMsg,phone_errMsg,Description_errMsg,file_errMsg ="";
        let errors = req.validationErrors();
        if (Object.keys(req.files).length == 0) {
          file_errMsg = 'No files were uploaded.';
        }else if (req.files.proposal_file.truncated == true) {
          file_errMsg = 'Maximum filesize should be 5MB';
        }
        else if (path.extname(req.files.proposal_file.name) != '.pdf') {
          file_errMsg = 'please convert your file to PDF';
        }
        if (errors){
          errors.forEach(function (error) {
            if(error.msg =='topic is required'){    proposal_topic_errMsg      ='topic is required';}
            if(error.msg =='fullname is required'){ fullname_errMsg            ='fullname is required';}
            if(error.msg =='invalid email'){        email_errMsg               ='invalid email';}
            if(error.msg =='phone number is required'){phone_errMsg            ='phone number is required';}
            if(error.msg =='Description must not be empty'){Description_errMsg ='Description must not be empty';}
          });

          res.send({
              proposal_topic_errMsg:proposal_topic_errMsg,
              fullname_errMsg:fullname_errMsg,
              email_errMsg:email_errMsg,
              phone_errMsg:phone_errMsg,
              Description_errMsg:Description_errMsg,
              file_errMsg:file_errMsg,
              inputFields:inputFields,
              messages:messages,
              ck:ck
          });

        }else if(file_errMsg != ''){
          res.send({
              proposal_topic_errMsg:proposal_topic_errMsg,
              fullname_errMsg:fullname_errMsg,
              email_errMsg:email_errMsg,
              phone_errMsg:phone_errMsg,
              Description_errMsg:Description_errMsg,
              file_errMsg:file_errMsg,
              inputFields:inputFields,
              messages:messages,
              ck:ck
          });
        }

        else {
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var FilePath = '/projects/botics-technologies/public/files/'+req.files.proposal_file.name;
          myFile.mv(FilePath,function (err) {
            if (err) {
              throw err;
            }
            var Myfilemain = prefix+'-'+x+'.pdf';
            var doc_tracking = prefix+'-'+x;
            var newFilePath =  '/projects/botics-technologies/public/files/'+Myfilemain;


            fs.renameSync(FilePath,newFilePath);
            var Proposal = new proposal({
              userid              : prefix+'-'+x,
              proposal_topic      : proposal_topic,
              fullname            : fullname,
              email               : email,
              phone_num           : phone_num,
              description         : descriptopn,
              filePath            : Myfilemain,
              docStatus           : false,
              viewed_timestamp    : '- - -',
              inprogress_timestamp: '- - -',
              completed_timestamp : '- - -',
              timestamp           : dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
            });
            Proposal.save(function (err) {
              if(err){
                throw err;
              }

        // send mail

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        tls:{ rejectUnauthorized: false},
        auth: {
          user: 'samueloduroonline@gmail.com',
          pass: 'miccheck1212'
        }

        });

        var mailOptions = {
        from: 'samueloduroonline@gmail.com',
        to: email,
        subject: 'Project proposal tracking code',
        html: "<header style='text-align:center;background:#007bff;color:#fff;padding:20px'> <h4>Botics Technologies</h4> </header><p>Proposal code: <b>"+doc_tracking+"</b></p>" // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            throw error
          }
           else {
          messages = email;
          res.send({
              proposal_topic_errMsg:proposal_topic_errMsg,
              fullname_errMsg:fullname_errMsg,
              email_errMsg:email_errMsg,
              phone_errMsg:phone_errMsg,
              Description_errMsg:Description_errMsg,
              file_errMsg:file_errMsg,
              inputFields:inputFields,
              messages:messages,
              ck:info.response
          });

        }
      });

    });

  });
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
});
router.get('/payment', function(req, res, next) {
  res.render('default/payments', { user:req.user});
});

router.post('/payment',function(req,res){
  var fname = req.body.fname ;
  var email= req.body.email;
  var pnumber= req.body.pnumber;
  var order_desc=req.body.order_desc;
  var amount=req.body.amount;
  var illegalChars = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;

  var fnameValidationErr       = "";
  var emailValidationErr       = "";
  var pnumberValidationErr     = "";
  var order_descValidationErr  = "";
  var amountValidationErr      = "";
  let inputs ={fname,email,pnumber,order_desc,amount}

  req.checkBody('fname','firstname is required').notEmpty();
  req.checkBody('email','please enter a valid email').isEmail();
  req.checkBody('pnumber','phone number is required').notEmpty();
  req.checkBody('order_desc','oder description is required').notEmpty();
  req.checkBody('amount','amount is required and must be decimal 0.00').isDecimal();

    let errors = req.validationErrors();
    if(errors){
    for(var i=0; i<errors.length;i++){
      if( errors[i].msg === 'firstname is required'){fnameValidationErr = 'firstname is required';}
      if( errors[i].msg === 'please enter a valid email'){emailValidationErr = 'please enter a valid email';}
      if( errors[i].msg === 'phone number is required'){pnumberValidationErr = 'phone number is required';}
      if( errors[i].msg === 'oder description is required'){order_descValidationErr = 'oder description is required';}
      if( errors[i].msg === 'amount is required and must be decimal 0.00'){amountValidationErr = 'amount is required and must be decimal 0.00';}
    }
  }
var check = illegalChars.test(pnumber);
if (check == false) {pnumberValidationErr = 'phone number is not valid';}
  if(fnameValidationErr != '' || emailValidationErr != '' || pnumberValidationErr != '' || order_descValidationErr != '' || amountValidationErr != ''){
      res.render('default/payments', {
        user:req.user,
        inputs:inputs,
        fnameValidationErr :fnameValidationErr,
        emailValidationErr :emailValidationErr,
        pnumberValidationErr :pnumberValidationErr,
        order_descValidationErr :order_descValidationErr,
        amountValidationErr:amountValidationErr,

      });
  }else{
    // MAKE PAYMENT
    const axios = require('axios');
    const sha1  = require('sha1');
    var ref     = GenRandomRef();
    var data = {};

    data.app_id     = '2452016064';
    data.app_key    = 'test';
    // var URL        = 'https://www.interpayafrica.com/interapi/ProcessPayment';
    var URL         = 'https://test.interpayafrica.com/interapi/ProcessPayment'
    data.name       = fname;
    data.email      = email;
    data.pnumber    = pnumber;
    data.return_url  = 'http://localhost:3000/payment/ConfirmPayment';
    data.currency   = 'GHS';
    data.amount     = amount;
    data.order_id   = ref;
    data.order_desc = order_desc;

    data.signature = data.app_id+data.app_key+data.order_id+data.amount+data.currency;
    data.signature = sha1(data.signature);
    axios.post(URL,data)
      .then((result)=>{
        console.log("=============Incoming response ===============");
        console.log(result.data);
        if (result.data.status_code == 1) {

          req.session.fullname    = fname;
          req.session.email       = email;
          req.session.phone_num   = pnumber;
          req.session.payment_description = order_desc;
          req.session.amount = amount;

          res.redirect(301,result.data.redirect_url);

        }else if (result.data.status_code == 0) {
          req.flash('danger',result.data.status_message);
          res.render('default/payments', { user:req.user});
        }
      })
      .catch((error)=>{
        console.log("=============response Error===============");
        console.log(error.message);
        console.log("============= End response Error ===================");
      })

  }


})

router.get('/payment/ConfirmPayment', function(req, res, next) {
  var status_code     = req.query.status_code;
  var status_message  = req.query.status_message;
  var trans_ref_no    = req.query.trans_ref_no;
  var order_id        = req.query.order_id;
  var signature       = req.query.signature;

  if (status_code == 1) {
    var services = new Services({
      fullname: req.session.fullname,
      email: req.session.email,
      phone_num: req.session.phone_num,
      payment_description: req.session.payment_description,
      amount: req.session.amount,
      trans_ref_no: trans_ref_no,
      payment_id: order_id,
      timestamp: new Date()
    });

    services.save(function (err,result) {
      if (err) {throw err}

      req.session.fullname    = "";
      req.session.email       =  "";
      req.session.phone_num   =  "";
      req.session.payment_description =  "";
      req.session.amount =  "";
      req.flash('success','Services payment made successfully!');
      res.render('default/payments', { user:req.user});
    });

  }else{
    req.session.fullname    = "";
    req.session.email       =  "";
    req.session.phone_num   =  "";
    req.session.payment_description =  "";
    req.session.amount =  "";
    req.flash('danger',status_message);
    res.render('default/payments', { user:req.user});
  }

})
router.get('/faq', function(req, res, next) {
  res.render('default/faqs', { user:req.user});
});
router.get('/tutorials', function(req, res, next) {

  var perPage = 12;
  var page = 1;

  tutorials
      .find({}).sort({_id:-1})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, videos) {
          tutorials.count().exec(function(err, count) {
            FeaturedVideo.find({}).sort({_id:-1}).limit(6).exec(function(err, featuredvid) {
              FeaturedVideo.find({}).sort({_id:-1}).limit(1).exec(function(err, vid_showing) {

              if (err) return next(err)
              res.render('tutorials/tutorials', {
                user:req.user,
                  videos: videos,
                  vid_showing:vid_showing,
                  featuredvid:featuredvid,
                  current: page,
                  pages: Math.ceil(count / perPage)
              })
            })

          })
      })
    })

});
// pagination
router.get('/tutorials/:page', function(req, res) {
  var perPage = 12
    var page = req.params.page || 1

    tutorials
         .find({})
         .skip((perPage * page) - perPage)
         .limit(perPage)
         .exec(function(err, videos) {
             tutorials.count().exec(function(err, count) {
                 if (err) return next(err)
                 res.render('tutorials/tutorials', {
                     videos: videos,
                     current: page,
                     pages: Math.ceil(count / perPage)
                 });
             });
         });
});
router.get('/tutorials/view/:id', function(req, res, next) {
  var tut_id = req.params.id;
  tutorials.findById(tut_id,function (err,tut_video) {

    tutorials.aggregate([{ $sample: { size: 8 } }],function (err,related_videos) {
      res.render('tutorials/tut_video', {
        user:req.user,
        tut_video : tut_video,
        related_videos : related_videos
      });
    })
  });


});
router.get('/featured_videos', function(req, res, next) {
  Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
    FeaturedVideo
    .find({})
    .exec(function(err, videos) {
      res.render('tutorials/featured_video',{
        user:req.user,
        product:product,
        videos:videos
      })
    })

  });
})
router.get('/featured_vid/view',function (req,res) {
  var id = req.query.id;
  FeaturedVideo.findById(id,function (err,f_video) {
    Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
      FeaturedVideo
      .find({})
      .exec(function(err, videos) {
        res.render('tutorials/view_featuredvideo',{
          user:req.user,
          product:product,
          videos:videos,
          f_video:f_video
        })
      })

    });
  })

})
router.get('/about', function(req, res, next) {
    Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
  res.render('user/about',{
    user:req.user,
    product:product
  });
});
});

function genId() {
var text = '';
var posible = '01234567890123456789' ;
 for (var i = 0; i < 4; i++) {
  text += posible.charAt(Math.floor(Math.random()* posible.length));
 }
 return text;
}

function genPrefix() {
var text = '';
var posible = 'ABCDEFGHJKLMNPQRSTUVWXYABCDEFGHJKLMNPQRSTUVWXY' ;
 for (var i = 0; i < 2; i++) {
  text += posible.charAt(Math.floor(Math.random()* posible.length));
 }
 return text;
}
function GenRandomRef() {
var text = '';
var posible = '01234567890123456789' ;
 for (var i = 0; i < 10; i++) {
  text += posible.charAt(Math.floor(Math.random()* posible.length));
 }
 return text;
}
module.exports = router;
