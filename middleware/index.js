var middlewareObj = {};
var Poll = require("../models/poll");
var User = require("../models/user");

middlewareObj.isLoggedIn = function(req, res, next) {
	// if user is authenticated in the session, carry on
	if(req.isAuthenticated()){
        return next();
	}
	// if they aren't redirect them to the home page
	req.flash("error", "Please Login First!");
	res.redirect('/login');
};

middlewareObj.isLoggedInCheck = function(req, res, next){
    if (req.isAuthenticated()){
        var path= (req.path);
	    if(path =="/register" || path == "/login")
		    return res.redirect("/");
		} return next();
	    
    };
middlewareObj.ownerCheck = function(req, res, next){
	if(req.isAuthenticated){
		Poll.findById(req.params.id, function(err, poll){
			if(err){
				console.log(err);
				res.redirect("back");
			} else{
				//does user own the poll?
				if(poll.maker.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "you dont have permission to do that!");
                	res.redirect("back");
				}
			}
		});
	} else{
	res.redirect("back");
	}
};
module.exports = middlewareObj;