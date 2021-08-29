const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
})


const WishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  },
  wishlist: [ItemSchema]
}, {
    timestamps: true
  })

const Wishlist = mongoose.model("Wishlist", WishlistSchema)

module.exports = { Wishlist }

