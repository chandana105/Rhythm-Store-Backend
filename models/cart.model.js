const mongoose = require("mongoose");
const { Schema } = mongoose;

const {Product} = require('./product.model.js')

const CartSchema = new Schema({
  product : [
    type : Schema.Types.ObjectId,
    ref : "Product"
  ]
})

const Cart = mongoose.model("Cart" , CartSchema)

module.exports = {Cart}

// Cart : []
// Cart : [{cartId : _id , product : populating(product's _id)}]