const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model.js");
const { extend } = require("lodash");

router
  .route("/")
  .get(async (_, res) => {
    try {
      const products = await Product.find({})     ;
      const message =
        products.length === 0
          ? "There are no products in the Collection, please start inserting them."
          : undefined;
      res.json({ success: true, products, message });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to find products",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;
      const NewProduct = new Product(product);
      const savedProduct = await NewProduct.save();
      res.json({ success: true, savedProduct });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to save product",
        errorMessage: err.message,
      });
    }
  })
  .delete(async (_, res) => {
    try {
      await Product.deleteMany({});
      res.status(200).json({
        success: true,
        deleted: true,
        message: "All Products are deleted from this Collection",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        deleted: false,
        message: "Couldn't delete the Collection",
        errorMessage: err.message,
      });
    }
  });

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get your product, Please check the productId again.",
      });
    }
    req.product = product;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your productId again" });
  }
});

router
  .route("/:productId")
  .get((req, res) => {
    let { product } = req;
    product.__v = undefined;
    res.json({ success: true, product });
  })
  .post(async (req, res) => {
    const productUpdates = req.body;
    let { product } = req;
    product = extend(product, productUpdates);
    product = await product.save();
    res.json({ success: true, updatedProduct: product });
  })
  .delete(async (req, res) => {
    let { product } = req;
    await product.remove();
    res.json({ success: true, deletedProduct: product, deleted: true });
  });

module.exports = router;
