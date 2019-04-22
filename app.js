const express             = require('express');
const path                = require('path');
const mongoose             = require('mongoose');
const bodyParser          = require('body-parser');
const expressValidator     = require('express-validator');
const flash               = require('connect-flash');
const session             = require('express-session');
const cookieParser        = require('cookie-parser');
const passport            = require('passport');
const fileUpload          = require('express-fileupload');
const MongoStore          = require('connect-mongo')(session);
var ContactUs             = require('./models/contactus');
var proposal              = require('./models/proposal');
var Cart                  = require('./models/cart');
var Order                 = require('./models/order');

mongoose.connect('mongodb://localhost:27017/boticstechnologiesdb', { useNewUrlParser: true });
var db = mongoose.connection;
require('./config/passport');
db.once('open',function () {
  console.log('Database online');
})
db.on('error',function (err) {
  console.log(err);
})

//init App
const app = express();
app.use(fileUpload({
  limits: { fileSize: 5000000 },
}));
// Load View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser('iloveprogramming'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(expressValidator());
// Express session middleware
app.use(session({
  secret: 'internetofthings',
  name: 'key',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  cookie:{ maxAge: 500 * 60 * 1000 }
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req,res,next) {
res.locals.messages = require('express-messages')(req,res);
res.locals.user     = req.isAuthenticated();
res.locals.session  = req.session;
next();
});


var index    = require('./routes/index');
var ecommerce    = require('./routes/ecommerce');
var users    = require('./routes/users');
var admin    = require('./routes/admin');
var admin_login = require('./routes/adminlogin');
var contactus    = require('./routes/contactus');
var SearchEngine    = require('./routes/SearchEngine');
app.use('/', index);
app.use('/pages/store-front', ecommerce);
app.use('/users', users);
app.use('/contactus', contactus);
app.use('/areacode97/admin/outofbound/admin', admin);
app.use('/areacode97/admin/outofbound', admin_login);
app.use('/Search', SearchEngine);
// app.use(function(req,res){
//     res.render('default/error_page');
// });
//Start server
var server = app.listen(3000,function () {
  console.log('Server started on port 3000...');
})
const io    = require('socket.io')(server);
var msgnotify='';
var propsnotify='';
io.on('connection', function (socket) {

  setInterval(function () {
    proposal.find({docStatus:'false'},function(err,PROPS) {
      propsnotify = PROPS.length;
      socket.emit('props', { PROPS: PROPS.length });
    })

    ContactUs.find({read:'false'},function(err,msg) {
      msgnotify = msg.length;
      socket.emit('msg', { msg: msg.length });
    });

    socket.emit('notify', { msg: msgnotify,props: propsnotify});
  },1000)

});
