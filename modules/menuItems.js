var mongoose=require("mongoose");
const {itemTypes} = require("../constants");
var menuItems=mongoose.Schema({
    text:String,
    price: String,
    type: {
        type: String,
        enum : itemTypes,
        default: 'Snacks'
    },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
},{
    timestamps : true
})

module.exports=mongoose.model("menuItems",menuItems);