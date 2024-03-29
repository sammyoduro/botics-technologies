var express        = require('express');
var router         = express.Router();
var Product        = require('../models/product');
var Cart           = require('../models/cart');
var Order           = require('../models/order');
var Item_Category  = require('../models/item_category');




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

const axios = require('axios');
const sha1 = require('sha1');

var cart = new Cart(req.session.cart);
var ref = GenRandomRef();

  var data = {};
  // data.app_id     = '2452016062';
  data.app_id     = '2452016064';
  data.app_key    = 'test';
  // var URL        = 'https://www.interpayafrica.com/interapi/ProcessPayment';
  var URL         = 'https://test.interpayafrica.com/interapi/ProcessPayment'
  data.name       = req.user.firstname+" "+req.user.lastname;
  data.email      = req.user.email;
  data.pnumber    = req.user.phone_num;
  data.ReturnURL  = '';

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
      console.log("=============Incoming response ===============");
      console.log(result.data);
      if (result.data.status_code == 1) {

        var order = new Order({
          user: req.user,
          cart: cart,
          address: 'phone: '+ data.pnumber+" email: "+data.email,
          name: data.name,
          paymentId: result.data.trans_ref_no,
          timestamp: new Date()
        });

        order.save(function (err,result) {
          if (err) {console.log(err);}

          req.flash('success','Items purchased successfully!');
          req.session.cart = "";
          res.redirect('/users/dashboard');
        });

        // res.redirect(result.data.redirect_url);
      }else if (result.data.status_code == 0) {
        req.flash('danger',result.data.status_message);
        res.redirect('/pages/store-front/p/shopping-cart/checkout');
      }
    })
    .catch((error)=>{
      console.log("=============response Error===============");
      console.log(error.message);
      console.log("============= End response Error ===================");
    })
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
