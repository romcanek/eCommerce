const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    description: {
        type: String,
    },
    inStock: {
        type: Number,
    },
    img: {
        type: String,
    },
});

module.exports = mongoose.model("Item", ItemSchema);
