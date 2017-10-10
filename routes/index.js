var express = require("express");
var router  = express.Router();
var Poll    = require("../models/poll");
var middleware = require("../middleware");



//RESTful path
router.get("/", function(req, res){
    Poll.find({},function(err,allPolls){
        if(err){
            console.log(err);
        } else{
            console.log(req.sessionID);
            res.render("enter",{polls:allPolls,message:"",session:req.sessionID});    
        }
    });
});
//INDEX
//NEW POLL ROUTE
router.post("/",middleware.isLoggedIn,function(req, res){
    var title   = req.body.title;
    var maker   = {
        fullname: req.user.local.fullname || req.user.facebook.name,
        id      : req.user._id
    };
    var options=[];
    for(var i=0;i<req.body.options.length;i++){
        options.push(req.body.options[i]);
    }
    var newPoll = {maker:maker,title:title,options:options};
    
   Poll.create(newPoll,function(err,poll){
        if(err){
            res.send("create error"); 
        } else{
            res.redirect("/");
        }
    });
});
//Create NEW
router.get("/create",middleware.isLoggedIn, function(req, res) {
    res.render("create");
    
});
module.exports = router;