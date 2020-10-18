var express=require("express");
var moment = require('moment');
var middleware=require("../middleware");
var router=express.Router();
var restaurant=require("../modules/restaurants");

//INDEX
router.get("/",function(req,res){
    restaurant.find({},function(err,allrestaurants){
        if(err)
        console.log(err);
        else
        {
            req.session.regenerate(function(err) {
  // will have a new session here
})
      res.render("restaurants/index",{restaurants:allrestaurants});
        }
  
    })
})

//create
router.post("/",middleware.isLoggedIn,function(req,res){
    var newrestaurant={title:req.body.name,
                       image:req.body.image,
                       description:req.body.description,
                       author:{username:req.user.username,id:req.user._id}
    };
    restaurant.create(newrestaurant,function(err,newcreated){
        if(err)
        console.log(err);
        else{
            req.flash("success","Restaurant Added succesfully");
            res.redirect("/restaurants");
        }
    })
    
})

//new
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("restaurants/new");
})
//SHOW
router.get("/:id",function(req, res) {
    restaurant.findById(req.params.id).populate({path: "menuItems", options: { sort:{"createdAt": 1}}}).exec(function(err,foundRestaurant){
        if(err)
        console.log(err);
        else{
            console.log(foundRestaurant);
            res.render("restaurants/show",{restaurant:foundRestaurant, moment});
        }
    })
    
})


//Edit
router.get("/:id/edit",middleware.isRestaurantAuthorised,function(req,res){
    restaurant.findById(req.params.id,function(err, foundRestaurant) {
        if(err)
        console.log(err);
        else
        res.render("restaurants/edit",{restaurant:foundRestaurant});
    })
})

//Update
router.put("/:id",middleware.isRestaurantAuthorised,function(req,res){
   restaurant.findByIdAndUpdate(req.params.id,req.body.restaurant,function(err,updated){
       if(err)
       console.log(err);
       else
       {
           req.flash("success","Restaurant Updated succesfully");
           res.redirect("/restaurants/"+req.params.id);
       }
       
   })
})

//Destroy
router.delete("/:id",middleware.isRestaurantAuthorised,function(req,res){
    restaurant.findByIdAndRemove(req.params.id,function(err){
        if(err)
        console.log(err);
        else
        {
            req.flash("success","Restaurant Deleted succesfully");
            res.redirect("/restaurants");
        }
        
    })
})




module.exports=router;