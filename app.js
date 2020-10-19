var express = require("express")(),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    User = require("./modules/user"),
    localstrategy = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    cp = require("cookie-parser")
    seedDB = require("./seeds");

var menuItemRoutes = require("./routes/menuItems"),
    indexRoutes = require("./routes/auth"),
    restaurantRoutes = require("./routes/restaurants");

//seedDB();
express.use(cp());
express.set("view engine", "ejs");
express.use(bodyparser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://user:pass@cluster0.9sxex.mongodb.net/db?retryWrites=true&w=majority", { useMongoClient: true })
    //mongoose.connect("mongodb://localhost/yelpcamp", { useMongoClient: true });
express.use(require("express").static("public"));
express.use(methodOverride("_method"));
express.use(flash());

//PASSPORT CONFIGURATIONS
express.use(require("express-session")({
    secret: "All You want to do is stay a minute ",
    resave: false,
    saveUninitialized: false,
}));
express.use(passport.initialize());
express.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

express.use(function(req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

//requiring routes
express.use("/restaurants/:id/menuItems", menuItemRoutes);
express.use(indexRoutes);
express.use("/restaurants", restaurantRoutes);

express.listen(process.env.PORT || 3000, function() {
    console.log("Started FoodShala server at 3000");
})