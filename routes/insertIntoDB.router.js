const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model.js");
const { productList } = require("../data/product-data.js");

router.route("/").get(async (_, res) => {
  try {
    productList.forEach(async (product) => {
      const isProductMatched = await Product.findOne({ name: product.name });
      if (isProductMatched) return;

      const newProduct = new Product({
        modelNo: product.modelNo,
        name: product.name,
        description: product.description,
        ratings: product.ratings,
        image: product.image,
        priceDetails: {
          originalPrice: product.priceDetails.originalPrice,
          discount: product.priceDetails.discount,
        },
        inStock: product.inStock,
        fastDelivery: product.fastDelivery,
        highlights: product.highlights,
      });
      const saved = await newProduct.save();
      if (!saved) {
        console.log("This product is not saved:", saved);
      }
    });
    res.json({
      success: true,
      message: "Products are inserted into DB",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to insert the products",
      errorMessage: err.message,
    });
  }
});

module.exports = router;
