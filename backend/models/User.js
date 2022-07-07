const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    admin: {
        type: Boolean,
    },
    itemsIDs: {
        type: Array,
        ref: "Item",
    },
});

module.exports = mongoose.model("User", UserSchema);
