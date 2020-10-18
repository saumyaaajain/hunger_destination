var mongoose = require("mongoose");
var restaurantsSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    menuItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "menuItems",
    }],
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
}, {
    usePushEach: true
});
module.exports = mongoose.model("restaurants", restaurantsSchema);