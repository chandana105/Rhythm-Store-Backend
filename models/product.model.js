const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    modelNo: {
      type: String,
      unique: true,
      required:
        "Cannot enter a product without model number, please enter model number of the product",
    },
    name: {
      type: String,
      unique: true,
      required: "Can't enter a product without name, please enter product name",
    },
    description: {
      type: String,
      required:
        "Can't enter a product without description, please enter description of the product",
    },
    ratings: Number,
    // if fast deleviery is false , the ndelivery : within 3-5 days
    image: {
      type: mongoose.SchemaTypes.Url,
      required:
        "Cannot enter a product without an image URL , please enter URL of the product",
    },
    priceDetails: {
      originalPrice: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
    },
    quantity: {
      type: Number,  
      default : 1
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    fastDelivery: {
      type: Boolean,
      default : false,
      required:
        "Cannot enter a product without knowing is it fast delivered or not ,please specify it",
    },
    highlights: [String],
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
