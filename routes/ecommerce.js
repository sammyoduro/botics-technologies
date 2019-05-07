var express        = require('express');
var router         = express.Router();
var Product        = require('../models/product');
var Cart           = require('../models/cart');
var Order           = require('../models/order');
var Item_Category  = require('../models/item_category');
var nodemailer          = require('nodemailer');
var async            = require('async');
const axios = require('axios');
const sha1 = require('sha1');

// Current Date & Time
var now = new Date();
var date =  now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
var formated_time = date+" "+time;

/* GET home page. */
router.get('/', function(req, res) {
var perPage = 8;
var page = 1;

Product
    .find({})
    .sort({_id:-1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, products) {
        Product.count().exec(function(err, count) {
            if (err) return next(err)

            Item_Category.find({},function (err,itemcat) {
              if (err) return next(err);
              Product.aggregate([{ $sample: { size: 3 } }],function (err,Pshuffle) {
              res.render('default/ecommerce', {
                user:req.user,
                  products: products,
                  Pshuffle:Pshuffle,
                  itemcat:itemcat,
                  current: page,
                  pages: Math.ceil(count / perPage)
              })
            })
            })
        })
    })

});
// pagination
router.get('/:page', function(req, res) {
  var perPage = 8
    var page = req.params.page || 1

    Product
         .find({})
         .skip((perPage * page) - perPage)
         .limit(perPage)
         .exec(function(err, products) {
             Product.count().exec(function(err, count) {
                 if (err) return next(err);

               Item_Category.find({},function (err,itemcat) {
                 if (err) return next(err);

                 Product.aggregate([{ $sample: { size: 3 } }],function (err,Pshuffle) {
                 res.render('default/ecommerce', {
                   user:req.user,
                     products: products,
                     Pshuffle:Pshuffle,
                     itemcat:itemcat,
                     current: page,
                     pages: Math.ceil(count / perPage)
                 })
               })
               })
             });
         });
});
// ADDING TO CART
router.get('/add-to-cart/:id',function (req,res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});
  Product.findById(productId,function (err,product) {
    if(err){
      return res.redirect('/pages/store-front');
    }
cart.add(product,product.id);
req.session.cart = cart;
res.send({'status': true});
  });

});
router.get('/buy-now/:id',function (req,res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});
  Product.findById(productId,function (err,product) {
    if(err){
      return res.redirect('../pages/store-front/shopping-cart');
    }
cart.add(product,product.id);
req.session.cart = cart;
res.redirect("/pages/store-front/p/shopping-cart");
  });

});
// PRODUCT DETAIL
router.get('/product_detail/p',function (req,res) {
var id = req.query.q;
Product.aggregate([{ $sample: { size: 2 } }],function (err,shuff_product) {
Product.findById(id,function (err,product) {

  res.render('shop/cartItem_detail',{
    product:product,
    shuff_product:shuff_product,
    user:req.user
  });
  });
});
});
router.post('/product_detail/increase/:id',function (req,res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});
  Product.findById(productId,function (err,product) {
    if(err){
      return res.redirect('/pages/store-front');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    res.send({'status': true});
  });

});

router.get('/product_detail/decrease/:id',function (req,res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});

cart.reduceByOne(productId);
req.session.cart = cart;
res.send({'status': true});

});
router.post('/product_detail/cartalter/',function (req,res) {
  var productId = req.body.id;
  var numOfItems = req.body.numOfItems;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});
  Product.findById(productId,function (err,product) {
    if(err){
      return res.redirect('/pages/store-front');
    }
cart.IncreaseBydetailInput(product,product.id,numOfItems);
req.session.cart = cart;
res.send({'status': true});
  });


});

// CHECKOUT
router.get('/increase/:id',function (req,res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});

  cart.increaseByOne(productId);
  req.session.cart = cart;
    res.send({'status': true});
});
router.get('/reduce/:id',function (req,res) {
    var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.send({'status': true});
});

router.get('/remove/:id',function (req,res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.send({'status': true});
});
//
router.post('/cartalter/',function (req,res) {
  var productId = req.body.id;
  var numOfItems = req.body.numOfItems;
  var parseNumOfItems;
  if(numOfItems == 0){
    parseNumOfItems = 1;
  }else{
    parseNumOfItems = numOfItems;
  }
  var cart = new Cart(req.session.cart ? req.session.cart: {items:{}});
  cart.IncreaseByInput(productId,parseNumOfItems);
  req.session.cart = cart;

  res.send({'status': true});
});

router.get('/p/shopping-cart',function (req,res) {

  if(!req.session.cart){
    Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
        if(err){throw err;}
    return res.render('shop/shopping-cart',{
      product : product,
      products:null,
      user:req.user
    });
    });
  }else{
    var cart = new Cart(req.session.cart);
    Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
        if(err){throw err;}

        res.render('shop/shopping-cart',{
          products:cart.generateArray(),
          totalPrice:cart.totalPrice,
          user:req.user,
          product : product
        });

      });
  }


});

router.get('/p/shopping-cart/checkout',isLoggedIn,function (req,res) {

  if(!req.session.cart){
    return res.redirect('/pages/store-front/p/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  Product.aggregate([{ $sample: { size: 2 } }],function (err,product) {
      if(err){throw err;}
      res.render('shop/checkout',{
        products:cart.generateArray(),
        totalPrice:cart.totalPrice,
        user:req.user,
        product : product,
      });

    });
});

router.post('/p/shopping-cart/checkout',isLoggedIn,function (req,res) {
  if(!req.session.cart){
    return res.redirect('/pages/store-front/p/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

var cart = new Cart(req.session.cart);
var ref = GenRandomRef();

  var data = {};
  // data.app_id     = '2452016064';
  // data.app_key    = 'test';
  data.app_id    = '7453014192';
  data.app_key    ='76716648';
  var URL         = 'https://www.interpayafrica.com/interapi/ProcessPayment';
  // var URL         = 'https://test.interpayafrica.com/interapi/ProcessPayment'
  data.name       = req.user.firstname+" "+req.user.lastname;
  data.email      = req.user.email;
  data.pnumber    = req.user.phone_num;
  data.return_url  = 'http://localhost:3000/pages/store-front/p/ConfirmPayment';
  data.currency   = 'GHS';
  data.amount     = cart.totalPrice;
  data.order_id   = ref;
  data.order_desc = req.body.order_desc;

  data.signature = data.app_id+data.app_key+data.order_id+data.amount+data.currency;
  signature     = sha1(data.signature);

  if (data.order_desc=="") {
    req.flash('danger','sorry! please enter Order description');
    res.redirect("/pages/store-front/p/shopping-cart/checkout");
  }else{

  axios.post(URL,data)
    .then((result)=>{
      if (result.data.status_code == 1) {
        res.redirect(301,result.data.redirect_url);

      }else if (result.data.status_code == 0) {
        req.flash('danger',result.data.status_message);
        res.redirect('/pages/store-front/p/shopping-cart/checkout');
      }
    })
    .catch((error)=>{
      console.log(error.message);
    })
  }
})

// Confirm user payment
router.get('/p/ConfirmPayment',isLoggedIn,function (req,res) {
  var status_code     = req.query.status_code;
  var status_message  = req.query.status_message;
  var trans_ref_no    = req.query.trans_ref_no;
  var order_id        = req.query.order_id;
  var signature       = req.query.signature;
  var cart = new Cart(req.session.cart);

if (status_code == 1) {
// Successful payment made
var mycart = cart.generateArray();
var counter = 0;

mycart.forEach(function (e) {
  Product.findById(e.item._id,function (err,prdt) {
    if (err) throw err;
    var ordered = +prdt.orders + +e.qty;

    if (prdt.quantities > 0 ) {
      Product.updateMany({'_id':e.item._id},{$set:{quantities:prdt.quantities-e.qty,orders:ordered}},function (err,callback) {
        if (err) throw err;
      })

    }else{
       return false;}
  })
counter++;
})
// <<<<<<<<<<<<<<<<<<inner<<<<<<<<<<<<<<<<<<<

if (counter == mycart.length) {

  var name  = req.user.firstname+" "+req.user.lastname;
  // SEND CONFIRMATION MESSAGE TO USER
  // ---------- start sms api --------------
  var url = "https://apps.mnotify.net/smsapi?key=7lhCpN4KlFFW0oo1UySwPEtmo&to="+req.user.phone_num+"&msg=Thank you for your purchase. \nWe have received your payment of Ghc "+cart.totalPrice+".Come by our office at Aboagye Menyeh Complex, FF11, Department of Computer Science,Knust to pick up your Item. Your order id is "+order_id+"&sender_id=Botics Shop"

  axios.get(url)
    .then((result)=>{
      console.log("============= SMS response===============");
      console.log(result.status);
      console.log(result.message);
      console.log("============= End SMS response ===================");
    })
    .catch((error)=>{
      console.log("=============response Error===============");
      console.log(error.message);
      console.log("============= End response Error ===================");
    })
  // -----------end sms api ----------------
  var order = new Order({
    user: req.user,
    cart: cart,
    address: 'phone: '+ req.user.phone_num+" email: "+ req.user.email,
    name: name,
    trans_ref_no: trans_ref_no,
    order_id: order_id,
    delivered: "processing order",
    timestamp: new Date()
  });

  // send mail

  var transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  tls:{ rejectUnauthorized: false},
  auth: {
    user: 'sales@boticstechnologies.com',
    pass: '10student@?'
  }

  });
var template = require('./template_sales');
var mailOptions = {
from: '"Botics Technologies" <sales@boticstechnologies.com>',
to: req.user.email,
subject: 'Payment Items Invoice',
html: template.output(order_id,trans_ref_no,req.user,cart.generateArray(),cart.totalPrice,formated_time) // html body
};
transporter.sendMail(mailOptions);
  order.save(function (err,result) {
    if (err) {console.log(err);}

    req.flash('success','Items purchased successfully!');
    req.session.cart = "";
    res.redirect('/users/dashboard');
  });
}
console.log("--------------------------");

}else{
  req.flash('danger',status_message);
  res.redirect('/pages/store-front/p/shopping-cart/checkout');
}
})
module.exports = router;

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }

  req.session.oldUrl = req.url;
  // req.session.oldUrl_reg = req.url;
  req.session.oldUrl_pass = 'please login before you can purchase successfully!';
  res.redirect('/users/login');
}

function GenRandomRef() {
var text = '';
var posible = '01234567890123456789' ;
 for (var i = 0; i < 10; i++) {
  text += posible.charAt(Math.floor(Math.random()* posible.length));
 }
 return text;
}
