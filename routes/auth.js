var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user"),
    middleware = require("../middleware");


// =====================================
// SIGNUP ==============================
// =====================================
router.get("/register",middleware.isLoggedInCheck, function(req, res){
    res.render("auth/register");
});
router.post("/register", passport.authenticate("local-signup",{
    successRedirect : "/profile",//move to profile
    failureRedirect : "/register",
    failureFlash : true //allow flash messages
}));
// =====================================
// LOGIN ===============================
// =====================================
router.get("/login",middleware.isLoggedInCheck, function(req, res){
   res.render("auth/login"); 
});
router.post("/login", passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
// =====================================
// PROFILE SECTION =====================
// =====================================
router.get('/profile',middleware.isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});
// =====================================
// LOGOUT ==============================
// =====================================
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect('/');
});
// =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



module.exports = router;