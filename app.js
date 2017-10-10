var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    flash                 = require("connect-flash"),
    bodyParser            = require("body-parser"),
    cookieParser          = require("cookie-parser"),
    expressSanitizer      = require("express-sanitizer"),//xss
    session               = require("express-session"),
    MongoStore            = require("connect-mongo")(session),
    morgan                = require("morgan"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    _                     = require('lodash'),
    methOverride        = require('method-override');

var Poll                  = require("./models/poll"),
    User                  = require("./models/user");
    
var authRoutes            = require("./routes/auth"),
    pollRoutes            = require("./routes/poll"),
    indexRoutes           = require("./routes/index");
    
//MONGODB
mongoose.connect("mongodb://naor:123@ds145263.mlab.com:45263/poll",{useMongoClient: true},function(err){
    if(err){
        console.log(err);
    } else{
        console.log("MongoLab CONNETCED");
    }
});
mongoose.Promise = global.Promise;

require('./config/passport.js')(passport); //pass passport to config


//APP USE/SET
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methOverride("_method"));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));//first dir script runing


//SESSION PASSPORT
// required for passport
app.use(session({ secret: 'mine',
                  store: new MongoStore({mongooseConnection: mongoose.connection})})); // session secret,session at mongo
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function(req, res, next){//pass all ejs 
   res.locals.currentUser = req.user;
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
});
// routes
app.use(authRoutes);
app.use(pollRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP,function(){
   console.log("Server Strated!"); 
});