var express       = require('express');
var router        = express.Router();
var dateFormat    = require('dateformat');
const randomstring= require('randomstring');
const path        = require('path');
var fs            = require('fs');
var bcrypt        = require('bcrypt-nodejs');
var proposal      = require('../models/proposal');
var Items         = require('../models/product');
var Admin          = require('../models/user');
var tutorials      = require('../models/tutorials');
var dateFormat     = require('dateformat');
var ContactUs      = require('../models/contactus');
var FeaturedVideo  = require('../models/featured_videos');
var frequent_search= require('../models/frequently_search');
var Order          = require('../models/order');
var Cart = require('../models/cart');
const moment       = require('moment');

// register admin
router.get('/adminsregistration', function(req, res) {
  Admin.find({$or:[{userType:'SUPERADMIN'},{userType:'ADMIN'}]},function (err,admins) {
    if (err) {
      throw err;
    }

    res.render('admin/users/registeradmins',{
      admins:admins,
      user:req.user
  });
  });

});
router.post('/adminsregistration',function(req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var pnumber = req.body.pnumber;
  var opnumber = req.body.opnumber;
  var email = req.body.email;
  var usertype = req.body.usertype;
  var password = randomstring.generate(8);
  var fnameValidationErr   = "";
  var lnameValidationErr   = "";
  var pnumberValidationErr = "";
  var opnumberValidationErr= "";
  var emailValidationErr   = "";

  let inputs ={fname,lname,pnumber,opnumber,email}
  req.checkBody('fname','firstname is required').notEmpty();
  req.checkBody('lname','lastname is required').notEmpty();
  req.checkBody('pnumber','phone number is required').notEmpty();
  req.checkBody('email','please enter a valid email').notEmpty().isEmail();
  let errors = req.validationErrors();
  if(errors){
  for(var i=0; i<errors.length;i++){
    if( errors[i].msg === 'firstname is required'){fnameValidationErr = 'firstname is required';}
    if( errors[i].msg === 'lastname is required'){lnameValidationErr = 'lastname is required';}
    if( errors[i].msg === 'phone number is required'){pnumberValidationErr = 'phone number is required';}
    if( errors[i].msg === 'please enter a valid email'){emailValidationErr = 'please enter a valid email';}
    }
  }
  Admin.findOne({'email':email},function (err,user) {
    if(err){
        throw err;
      }
      if(fnameValidationErr != '' || lnameValidationErr != '' || pnumberValidationErr != '' || emailValidationErr != ''){
        Admin.find({$or:[{userType:'SUPERADMIN'},{userType:'ADMIN'}]},function (err,admins) {

        res.render('admin/users/registeradmins',{
          admins:admins,
          inputs:inputs,
          fnameValidationErr :fnameValidationErr,
          lnameValidationErr :lnameValidationErr,
          pnumberValidationErr :pnumberValidationErr,
          emailValidationErr :emailValidationErr,
          user:req.user
          });
          });

      }
      else if ( user ) {
          Admin.find({$or:[{userType:'SUPERADMIN'},{userType:'ADMIN'}]},function (err,admins) {
            proposal.find({docStatus:'false'},function(err,PROPS) {
              ContactUs.find({read:'false'},function(err,msg) {
        res.render('admin/users/registeradmins',{
          admins:admins,
          PROPS:PROPS.length,
          msg:msg.length,
          });
        });
      });
      });
      }
      else{
        var hashpwrd =  bcrypt.hashSync(password,bcrypt.genSaltSync(8));
        var admin = new Admin({
          userType:usertype,
          firstname:fname,
          lastname:lname,
          phone_num:pnumber,
          Otherphone_num:opnumber,
          email:email,
          password:hashpwrd
        });

        admin.save(function (err,results) {
          if(err){
            throw err;
          }
          var messages = req.flash({message:'Admin saved successfully'});
          res.redirect('/areacode97/admin/outofbound/admin/adminsregistration');
        });

      }

    })
})


router.get('/messages',isLoggedIn, function(req, res) {

ContactUs.find({},function functionName(err,messages) {
  if (err) {
    throw err;
  }
  res.render('admin/messages',{
    messages:messages,
    user:req.user
  });
}).sort({_id:-1});

});
router.post('/messages',isLoggedIn, function(req, res) {

  ContactUs.update({'_id':req.body.id}, {$set: {read : true}}, function(err, result){
    res.send({status:true});
})
})
router.get('/messages/del/',isLoggedIn, function(req, res) {
  let id = req.query.p;
  ContactUs.deleteOne({'_id':id},function (err, result) {
    res.redirect('/areacode97/admin/outofbound/admin/messages');
  })
})
// =============================== admin login end ============================
router.get('/proposals',isLoggedIn, function(req, res) {
proposal
      .find({}).sort({_id:-1})
      .exec(function (err,proposals) {
        proposal.count().exec(function (err,count) {
          if(err) return next(err);
          res.render('admin/proposals/proposals',{
            count:count,
            proposals:proposals,
            user:req.user
        })
        })
      })
});
router.get('/proposals/referesh',isLoggedIn,function (req,res) {
  proposal.find({docStatus:'false'},function(err,PROPS) {
    ContactUs.find({read:'false'},function(err,msg) {
  res.send({props:PROPS.length,msg:msg.length})
      })
    })
})
router.post('/viewed/:q',isLoggedIn, function(req, res) {
var id = req.body.id;
var state = req.body.state

if (state == 'viewed') {
  proposal.update({'_id':id}, {$set: {docStatus : 'viewed',viewed_timestamp:dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")}}, function(err, result){
    res.send({status:true});
    });
}
if (state == 'progres') {
  proposal.update({'_id':id}, {$set: {docStatus : 'inprogress',inprogress_timestamp:dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")}}, function(err, result){
    res.send({status:true});
    });
}
if (state == 'completed') {
  proposal.update({'_id':id}, {$set: {docStatus : 'completed',completed_timestamp:dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")}}, function(err, result){
    res.send({status:true});
    });
}

});
router.get('/items',isLoggedIn, function(req, res) {
            Items.find({},function functionName(err,components) {
              if(err) return next(err);
              res.render('admin/items/items',{
                components  :components,
                user:req.user

          })
          }).sort({_id:-1})
      })


router.post('/items',isLoggedIn, function(req, res) {

  var itemtitle       = req.body.itemtitle;
  var itemprice       = req.body.itemprice;
  var itemQuantity    = req.body.itemQuantity;
  var itemdescription = req.body.itemdescription;
  var detailtemdescription = req.body.detailtemdescription;
  var itemcategory = req.body.itemcat;

  var itemtitle_errMsg= '';
var itemprice_errMsg = '';
var itemQuantity_errMsg = '';
var itemdescription_errMsg = '';
var detailtemdescription_errMsg = '';
var file1_errMsg = '';

var incomingData = {
itemtitle:itemtitle,
itemprice:itemprice,
itemQuantity:itemQuantity,
itemdescription:itemdescription,
detailtemdescription:detailtemdescription
}
req.checkBody("itemtitle","topic is required").notEmpty();
req.checkBody("itemprice","price is required and must be float").notEmpty().isFloat();
req.checkBody("itemQuantity","quantity is required and must must be integer").notEmpty().isInt();
req.checkBody("itemdescription","description is required").notEmpty();
req.checkBody("detailtemdescription","Detailed description is required").notEmpty();


if (Object.keys(req.files).length == 0) {
  file1_errMsg="No files were uploaded";
}

for (var key in req.files) {
 if ((path.extname(req.files[key].name) !=('.jpg')) && (path.extname(req.files[key].name) !=('.PNG')) && (path.extname(req.files[key].name) !=('.png'))) {
  file1_errMsg = "please file should be jpg or png";
  }
}

let errors = req.validationErrors();
if (errors){
  errors.forEach(function (error) {
    if(error.msg =="topic is required"){ itemtitle_errMsg = "topic is required";}
    if(error.msg =="price is required and must be float"){ itemprice_errMsg ="price is required and must be float";}
    if(error.msg =="quantity is required and must must be integer"){itemQuantity_errMsg="quantity is required and must must be integer";}
    if(error.msg =="description is required"){itemdescription_errMsg = "description is required";}
    if(error.msg =="Detailed description is required"){detailtemdescription_errMsg = "Detailed description is required";}
  });
}

if((itemtitle_errMsg == "") && (itemprice_errMsg == "") && (itemQuantity_errMsg == "") && (itemdescription_errMsg == "") && (detailtemdescription_errMsg == "") && (file1_errMsg == "")){
var filesArray = [];

var myFile1 = req.files.img1;
var myFile2 = req.files.img2;
var myFile3 = req.files.img3;
var myFile4 = req.files.img4;

var myFile1data;
var myFile2data;
var myFile3data;
var myFile4data;
if(myFile1 != undefined){if (path.extname(myFile1.name) == '.jpg'){myFile1data = Date.now()+1+'.jpg';}else{myFile1data = Date.now()+1+'.png';}}
if(myFile2 != undefined){if (path.extname(myFile2.name) == '.jpg'){myFile2data = Date.now()+2+'.jpg';}else{myFile2data = Date.now()+2+'.png';}}
if(myFile3 != undefined){if (path.extname(myFile3.name) == '.jpg'){myFile3data = Date.now()+3+'.jpg';}else{myFile3data = Date.now()+3+'.png';}}
if(myFile4 != undefined){if (path.extname(myFile4.name) == '.jpg'){myFile4data = Date.now()+4+'.jpg';}else{myFile4data = Date.now()+4+'.png';}}

if(myFile1 != undefined){myFile1.mv('/projects/botics-technologies/public/images/'+myFile1.name,function (err) {fs.renameSync('/projects/botics-technologies/public/images/'+myFile1.name,'/projects/botics-technologies/public/images/'+ myFile1data);})}
if(myFile2 != undefined){myFile2.mv('/projects/botics-technologies/public/images/'+myFile2.name,function (err) {fs.renameSync('/projects/botics-technologies/public/images/'+myFile2.name,'/projects/botics-technologies/public/images/'+ myFile2data);})}
if(myFile3 != undefined){myFile3.mv('/projects/botics-technologies/public/images/'+myFile3.name,function (err) {fs.renameSync('/projects/botics-technologies/public/images/'+myFile3.name,'/projects/botics-technologies/public/images/'+ myFile3data);})}
if(myFile4 != undefined){myFile4.mv('/projects/botics-technologies/public/images/'+myFile4.name,function (err) {fs.renameSync('/projects/botics-technologies/public/images/'+myFile4.name,'/projects/botics-technologies/public/images/'+ myFile4data);})}

var item = new Items({
    item_category     : itemcategory,
     imagePath_one    :myFile1data ? myFile1data:'' ,
     imagePath_two    :myFile2data ? myFile2data:'' ,
     imagePath_three  :myFile3data ? myFile3data:'' ,
     imagePath_four   :myFile4data ? myFile4data:'' ,
     title            :itemtitle,
     description      :itemdescription,
     detailed_description:detailtemdescription,
     price            :itemprice,
     quantities       :itemQuantity
   });

   item.save(function (err) {
 if(err){
   throw err;
 }
 incomingData = {};
           Items.find({},function functionName(err,components) {
             if(err) return next(err);
             res.redirect('/areacode97/admin/outofbound/admin/items');
           })
})

}else{
  Items.find({},function functionName(err,components) {
     if(err) return next(err);
     res.render('admin/items/items',{
       components  :components,
      itemtitle_errMsg:itemtitle_errMsg,
      itemprice_errMsg:itemprice_errMsg,
      itemQuantity_errMsg:itemQuantity_errMsg,
      itemdescription_errMsg:itemdescription_errMsg,
      detailtemdescription_errMsg:detailtemdescription_errMsg,
      file1_errMsg:file1_errMsg,
      incomingData: incomingData,
      done:false,
      user:req.user
     });
   })
}
});

router.post('/ulter',isLoggedIn, function(req, res) {
var id = req.body.id;
var itemtitle = req.body.itemtitle;
var itemprice = req.body.itemprice;
var itemQuantity = req.body.itemQuantity;
var itemdescription = req.body.itemdescription;
var del = req.body.del;
var detailtemdescription = req.body.detailtemdescription;

if (del == 'delete'){
  Items.deleteOne({'_id':id},function (err, result) {
    res.send(result);
  });
}else{
  Items.updateMany({'_id':id}, {$set: {title : itemtitle,price : itemprice,quantities:itemQuantity,description:itemdescription,detailed_description:detailtemdescription}}, function(err, result){
    res.send(result);
  });
}
});


function renameImg1() {
var text = '';
var posible = '0123456789012345678901234567890123456789';
 for (var i = 0; i < 20; i++) {
  text += posible.charAt(Math.floor(Math.random()* posible.length));
 }
 return text;
}
// FEATURED VIDEOS
router.get('/featured_vid',isLoggedIn,function (req,res) {
  FeaturedVideo
  .find({}).sort({_id:-1})
  .exec(function(err, videos) {
    res.render('admin/tutorials/featured_videos',{
      user:req.user,
      videos:videos
    })
  })

})
router.post('/featured_vid',isLoggedIn,function (req,res) {
  var title = req.body.title;
  var vid_image = req.body.vid_image;
  var vid_url = req.body.vid_url;
  var title_err="";
  var vid_image_err="";
  var vid_tut_err="";

  req.checkBody("title","title required").notEmpty();
  req.checkBody("vid_image","video image required").notEmpty();
  req.checkBody("vid_url","video url required").notEmpty();

  let errors = req.validationErrors();
  if (errors){
    errors.forEach(function (error) {
      if(error.msg =="title required"){ title_err = "title required";}
      if(error.msg =="video image required"){ vid_image_err = "video image required";}
      if(error.msg =="video url required"){ vid_tut_err = "video url required";}
    })
  }
  if (title_err == "" && vid_image_err=="" && vid_tut_err == "") {
    var fdvid = new FeaturedVideo({
      title:title,
      video_img_url:vid_image,
      video_url:vid_url,
      timestamp:dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
    });

    fdvid.save(function (err,results) {
      FeaturedVideo
      .find({}).sort({_id:-1})
      .exec(function(err, videos) {
        res.render('admin/tutorials/featured_videos',{
          user:req.user,
          sucmsg :'Featured video saved successfully',
          videos:videos
        })
      })

    })

  }else{
    FeaturedVideo
    .find({}).sort({_id:-1})
    .exec(function(err, videos) {
      res.render('admin/tutorials/featured_videos',{
        user:req.user,
        videos:videos,
        title_err:title_err,
        vid_image_err:vid_image_err,
        vid_tut_err:vid_tut_err
      })
    })

  }

})
router.get('/featured_vid/delete/',isLoggedIn,function (req,res) {
  var id = req.query.id;
FeaturedVideo.deleteOne({'_id':id},function (err, result) {
  res.redirect('/areacode97/admin/outofbound/admin/featured_vid');
})
})
// Tutorials
router.get('/tutorials/new',isLoggedIn, function(req, res) {
  tutorials.find(function (err,tut_video) {
            if(err) return next(err);
            res.render('admin/tutorials/tutorials',{
              videos:tut_video,
              user:req.user
        })
      }).sort({_id:-1});
});

router.post('/tutorials/new',isLoggedIn, function(req, res) {
  var vidurl       = req.body.vidurl;
  var vid_imgurl   = req.body.vid_imgurl;
  var tshortdesc   = req.body.tshortdesc;
  var overview     = req.body.overview;
  var instructions = req.body.instructions;
  var myFile        = req.files.materials;
  var vidurl_errMsg= '';
  var vid_imgurl_errMsg = '';
  var tshortdesc_errMsg = '';
  var overview_errMsg = '';
  var instructions_errMsg = '';
  var materials_errMsg = '';

  req.checkBody("vidurl","video url is required").notEmpty();
  req.checkBody("vid_imgurl","video image url is required").notEmpty();
  req.checkBody("tshortdesc","tutorials short description is required").notEmpty();
  req.checkBody("overview","overview must not be empty").notEmpty();
  req.checkBody("instructions","instructions must not be empty").notEmpty();
  if (Object.keys(req.files).length == 0) {
    materials_errMsg="No files were uploaded";
  }
  for (var key in req.files) {
    if(req.files[key].truncated == true) {
      materials_errMsg = "Maximum filesize should be 5MB";
    }
    else if ((path.extname(req.files[key].name) !=('.ino'))) {
    materials_errMsg = "invalid arduino file";
    }
  }

  let errors = req.validationErrors();
  if (errors){
    errors.forEach(function (error) {
      if(error.msg =="video url is required"){ vidurl_errMsg = "video url is required";}
      if(error.msg =="video image url is required"){ vid_imgurl_errMsg ="video image url is required";}
      if(error.msg =="tutorials short description is required"){tshortdesc_errMsg="tutorials short description is required";}
      if(error.msg =="overview must not be empty"){overview_errMsg = "overview must not be empty";}
      if(error.msg =="instructions must not be empty"){instructions_errMsg = "instructions must not be empty";}
    });
  }

if((vidurl_errMsg == "") && (vid_imgurl_errMsg == "") && (tshortdesc_errMsg == "") && (overview_errMsg == "") && (instructions_errMsg == "") && (materials_errMsg == "")){
var FilePath = '/projects/botics-technologies/public/files/'+myFile.name;
myFile.mv(FilePath,function (err) {
  if (err) {
    throw err;
  }
  var tuts = new tutorials({
    short_desc     :tshortdesc,
    overview       :overview,
    instructions   :instructions,
    materials      :myFile.name,
    videoImg_url   :vid_imgurl,
    video_url      :vidurl,
    timestamp      :dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
  });

  tuts.save(function (err) {
    if(err){
      throw err;
    }

    tutorials.find(function (err,tut_video) {
      if(err) return next(err);
      res.render('admin/tutorials/tutorials',{
        videos:tut_video,
        user:req.user
      })
    })
  })
});
}else{

  tutorials.find(function (err,tut_video) {
            if(err) return next(err);
            res.render('admin/tutorials/tutorials',{
              videos          :tut_video,
              vidurl_errMsg      :vidurl_errMsg,
              vid_imgurl_errMsg  :vid_imgurl_errMsg,
              tshortdesc_errMsg  :tshortdesc_errMsg,
              overview_errMsg    :overview_errMsg,
              instructions_errMsg:instructions_errMsg,
              materials_errMsg   :materials_errMsg,
              user:req.user
            });
          })
}

});

// DELETE Proposal
router.get('/proposal/del/:q',isLoggedIn, function(req, res) {
  var id_base = req.params.q;
  var id = id_base.split('&')[0];
  var psal = id_base.split('=')[1];

  fs.unlink('/projects/botics-technologies/public/files/'+psal+'.pdf', function (err) {
  if (err) {throw err};
});

  proposal.deleteOne({'_id':id},function (err, result) {
      res.send(result);
  });

});
// SEARCH PROPOSAL
router.post('/proposal/search/',isLoggedIn, function(req, res) {
  var searchitem = req.body.searchitem;

  proposal.find({userid: {$regex: searchitem, $options: '/^i/'}},function (err, result) {
      res.send(result);
  });
});
// frequently SEARCHED
router.get('/frequently_searched',isLoggedIn,function (req,res) {
  frequent_search.find({},function (err,frequent_search_item) {
    if (err) {
      throw err;
    }
    res.render('admin/frequently_search',{
      user:req.user,
      frequent_search_item:frequent_search_item
    });

  }).sort({_id:-1})

});
// ORDERS
router.get('/orders',isLoggedIn,function (req,res) {
  Order.find({})
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
    console.log(orders);
    res.render('admin/orders/orders',{
      user:req.user,
      orders:orders,
      moment:moment
    });
  });

})
router.get('/page/logout',function (req,res) {
  req.logout();
  res.redirect('/areacode97/admin/outofbound');
});
// route to middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

    // if user is logged in -
    if (req.isAuthenticated()){
      return next();
    }else{
      // if they aren't redirected them to home
      res.redirect('/areacode97/admin/outofbound');
    }


}
module.exports = router;
