var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose")
var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    userType: {
        type: String,
        enum : ['user','admin'],
        default: 'user'
    },
})
UserSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User",UserSchema);