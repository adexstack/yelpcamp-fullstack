var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
          } else {
              // does user own the campground?
           if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) { // cant use comparism check === cz author.id gives an object and user._id gives  a string
              next();
           } else {
               req.flash("error", "You do not have permission to do that");
               res.redirect("back");
           }
          }
        });
    } else {
       req.flash("error", "You need to be logged in to do that") 
       res.redirect("back");
    }
}
    

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
            res.redirect("back");
          } else {
              // does user own the comment?
           if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) { // cant use comparism check === cz author.id gives an object and user._id gives  a string
              next();
           } else {
               req.flash("error", "You don't have permission to do that");
               res.redirect("back");
           }
          }
        });
        
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};
     

// middleware       
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

// Adding for error and crash handling  
middlewareObj.checkUserCampground = function(req, res, next){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground){
          console.log(err);
          req.flash('error', 'Sorry, that campground does not exist!');
          res.redirect('/campgrounds');
      } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
          req.campground = foundCampground;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/campgrounds/' + req.params.id);
      }
    });
  };

// Adding for error and crash handling    
middlewareObj.checkUserComment = function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  };

module.exports = middlewareObj;