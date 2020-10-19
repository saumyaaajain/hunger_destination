//all middlewares goes here
var restaurant=require("../modules/restaurants");
var menuId=require("../modules/menuItems");
var middlewareObj={};
middlewareObj.isRestaurantAuthorised=function(req,res,next){
    if(req.isAuthenticated())
    {
            restaurant.findById(req.params.id,function(err,foundRestaurant){
            if(err)
            {
                req.flash("error","Restaurant Not Found");
                res.redirect("back");
            }
            else
            {
                if(foundRestaurant.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","Access Denied!")
                    res.redirect("back");
                }
            }
            
    })
    }
    else
    {
        req.flash("error","You must be logged in to do that!");
        res.redirect("/login");res.redirect("/login");
    }
    
}


middlewareObj.isMenuItemAuthorised=function(req,res,next){
    if(req.isAuthenticated())
    {
            menuId.findById(req.params.menuItem_id,function(err,foundComment){
            if(err)
            console.log(err);
            else
            {
                // console.log(foundComment.author.id);
                if(req.user.userType === "admin" && foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","Access Denied!")
                    res.redirect("back");
                }
            }
            
    })
    }
    else
    {
        req.flash("error","You must be logged in to do that!")
        res.redirect("/login");
    }
    

}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
    {
        console.log(req.session);
        next();
       
    }
    
    else
    {
        req.flash("error","You must be logged in to do that!");
        res.redirect("/login");
    }
    

}
module.exports=middlewareObj;