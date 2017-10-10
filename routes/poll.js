var express = require("express");
var router  = express.Router();
var Poll    = require("../models/poll");
var User    = require("../models/user")
var _                     = require('lodash');
var Chart                 = require("chart.js");
var middleware = require("../middleware");


//SHOW POLL
router.get("/poll/:id",function(req, res) {
    Poll.findById(req.params.id,function(err,foundPoll){
        if(err){
            console.log(err);
            res.send("findByid poll error");
        } else{
            res.render("show",{poll:foundPoll,array:[1,2,3,4,5]});
        }
    });
});
//DELETE
router.delete("/poll/:id/delete",middleware.ownerCheck, function(req, res){
    Poll.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error","Sorry, you cant delete this Poll");
            res.redirect("/");
        } else{
            req.flash("success","The Poll Deleted");
            res.redirect("/");
      }
   });
    });
//VOTE
router.post("/poll/:id/:option_id", function(req, res){
   Poll.findById(req.params.id,function(err, poll){     //Find the Poll
       if(err){
           console.log("Vote(find the Poll) post err");
        }
        var test = function(poll,req, callback){
                var flag=0;
                var auth;
                console.log(req.user);
                if (typeof req.user === 'undefined'){
                    auth=0;
                } else{auth=1;}
                if(auth){//if it`s auth user
                    User.findById(req.user._id,function(err, userFound){//look for id user
                        if(err){
                            console.log("[checkVoted] Error findById");
                            }
                        for(var i=0;i<userFound.local.vote.poll_voted.length;i++){//runnig on poll_voted array
                            if(poll._id == userFound.local.vote.poll_voted[i]){
                                flag=1;//User already voted
                            }
                        }{//end for
                    callback(flag);
                    }});//end user find
                }else{//if it`s anonmyous user
                    flag=2;
                    callback(flag);
                    }
            };//test function end
            test(poll, req, function(param){
                if(param===1){//user already voted
                    req.flash("error","Sorry, You already vote to this Poll");
                    res.redirect("/poll/"+poll._id);
                    return;
                } else if(param===0){//find the id and save in voted poll
                    User.findById(req.user._id, function(err, user) {
                        if(err){
                            console.log("[VOTE>POST>User.findByID ERROR");
                        } else{
                            user.local.vote.poll_voted.push(poll._id); 
                            user.save(function(err){
                                if(err){
                                console.log("save user._id in poll_voted ERORR");
                            }});
                    }});//end User.findById
                }else if(param===2){
                    for(var i=0;i<poll.anonmyUser.length;i++){
                        if(req.sessionID === poll.anonmyUser[i]){
                            req.flash("error","Sorry, You already vote to this Poll");
                            res.redirect("/poll/"+poll._id);
                            return;
                        }
                    }//end for
                    poll.anonmyUser.push(req.sessionID);
                    poll.save(function(err){
                        if(err){
                            console.log("save anonmyUser vore ERROR");    
                        }
                    });
                }//end elseif=2
                    var options = poll.options;
                    var optionIndex = _.findIndex(options,["id", req.params.option_id]);
                    poll.options[optionIndex].vote++;
                    poll.save(function(err){
                    if(err){
                        console.log("save vote error");
                    } else{
                        req.flash("success","Thank You for voting!");
                        res.redirect("/poll/"+poll._id);
                    }});
                });
            });
});


module.exports = router;