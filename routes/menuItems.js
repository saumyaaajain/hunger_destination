var express = require("express");
var middleware = require("../middleware");
var router = express.Router({ mergeParams: true });
var restaurant = require("../modules/restaurants");
var menuItem = require("../modules/menuItems");
//==============
//MenuItem ROUTES
//==============

//CREATE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    restaurant.findById(req.params.id, function(err, found) {
        if (err)
            console.log(err);
        else {
            res.render("menuItems/new", { restaurant: found });
        }
    })
})

//NEW
router.post("/", middleware.isLoggedIn, function(req, res) {
    restaurant.findById(req.params.id, function(err, foundRestaurant) {
        if (err) {
            console.log(err);
            res.redirect("/restaurants");
        } else {
            menuItem.create(req.body.menuItem, function(err, menuItem) {
                console.log(menuItem)
                if (err) {
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                } else {
                    menuItem.author.id = req.user._id;
                    menuItem.author.username = req.user.username;
                    menuItem.save();
                    foundRestaurant.menuItems.push(menuItem);
                    foundRestaurant.save(function(err) {
                        console.log("callback");
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                    });
                    req.flash("success", "Successfully added your menuItem")
                    res.redirect("/restaurants/" + req.params.id);
                }

            })
        }
    })
})

//EDIT
router.get("/:menuItem_id/edit", middleware.isMenuItemAuthorised, function(req, res) {
    menuItem.findById(req.params.menuItem_id, function(err, foundMenuItem) {
        if (err)
            console.log(err);
        else {

            res.render("menuItems/edit", { menuItem: foundMenuItem, restaurant_id: req.params.id });
        }

    })
})

//UPDATE
router.put("/:menuItem_id", middleware.isMenuItemAuthorised, function(req, res) {
    menuItem.findByIdAndUpdate(req.params.menuItem_id, req.body.menuItem, function(err, foundMenuItem) {
        if (err)
            console.log(err)
        else
            res.redirect("/restaurants/" + req.params.id);
    })
})

//DESTROY
router.delete("/:menuItem_id", middleware.isMenuItemAuthorised, function(req, res) {
    menuItem.findByIdAndRemove(req.params.menuItem_id, function(err) {
        if (err)
            console.log(err);
        else {
            req.flash("success", "MenuItem Deleted");
            res.redirect("/restaurants/" + req.params.id);
        }

    })
})



module.exports = router;