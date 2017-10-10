var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User           = require("../models/user");
// load the auth variables
var configAuth = require('./auth');
// expose this module.exports
module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
       // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use("local-signup", new LocalStrategy({
       usernameField : "email",
       passwordField : "password",
       passReqToCallback : true
    },
    function(req, email, password, done){
        User.findOne({'local.email' : email}, function(err, user) {
           if(err){return done(err); }
           //check iif already a user with that email
           if(user){
               return done(null, false, req.flash('error','That email is already taken.'));
           } else{
               //if all is ok
               //create the user
               var newUser             = new User();
               
               newUser.local.email     = email;
               newUser.local.password  = newUser.generateHash(password);
               newUser.local.fullname  = req.body.fullname;
               
               //save the user
               newUser.save(function(err){
                   if(err){throw err;}
                   return done(null, newUser);
               });
           }
        });
    }));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use("local-login", new LocalStrategy({
        usernameField : "email",
        passwordField : "password",
        passReqToCallback : true // allow pass hack the entire request to callback
    },
    function(req, email, password, done){
        //find user whose email is same as the forms email
        //check
        User.findOne({"local.email" : email},function(err, user){
            if(err)
                return done(err);
            if(!user)
                return done(null, false, req.flash('error', 'No user found.'));
            if(!user.validPassword(password))
                return done(null, false, req.flash('error', 'Oops! Wrong password.'));
            return done(null, user);
        });
    }));
     // =========================================================================
    // FACEBOOK LOGIN =============================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        clientID       : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : configAuth.facebookAuth.profileFields
    },
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            //find the user
            User.findOne({ 'facebook.id':profile.id},function(err, user){
                if(err)
                    return done(err);
                if(user){
                    return done(null, user);//user found return the user
                } else{
                    var newUser          = new User();
                    
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first
                    
                    
                    //save
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        //success
                        return done(null, newUser);
                    });
                }
            });
        });
    
    }));
};