const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    default: 1
  },
})

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  },
  cartList: [ItemSchema]
}, {
    timestamps: true
  })

const Cart = mongoose.model("Cart", CartSchema)

module.exports = { Cart }

