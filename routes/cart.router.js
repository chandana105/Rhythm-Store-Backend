const express = require("express");
const router = express.Router();
const { Cart } = require('../models/cart.model.js')
const { extend } = require("lodash");


router
  .route('/')
  .get(async (_, res) => {
    try {
      const cart = await Cart.find({}).populate("cartList.product")
      const message =
        cart.length === 0
          ? "There are no products in the Cart, please start adding them."
          : undefined;
      res.json({ success: true, cart, message });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to find cart products",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const cart = req.body
      const NewCart = new Cart(cart)
      const savedCart = await NewCart.save()
      res.json({ success: true, cart: savedCart })
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to save cart", errorMessage: err.message })
    }
  })
  .delete(async (_, res) => {
    try {
      await Cart.deleteMany({});
      res.status(200).json({
        success: true,
        deleted: true,
        message: "All Products are deleted from the Carts",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        deleted: false,
        message: "Couldn't delete the Cart",
        errorMessage: err.message,
      });
    }
  });

router.param("cartId", async (req, res, next, cartId) => {
  try {
    const cart = await Cart.findById(cartId).populate("cartList.product");
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get your cart, Please check the cartId again.",
      });
    }
    req.cart = cart;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your cartId again" });
  }
});

router
  .route("/:cartId")
  .get((req, res) => {
    let { cart } = req;
    cart.__v = undefined;
    res.json({ success: true, cart });
  })
  .post(async (req, res) => {
    const cartUpdates = req.body;
    let { cart } = req;
    cart = extend(cart, cartUpdates);
    cart = await cart.save();
    res.json({ success: true, updatedCart: cart });
  })
  .delete(async (req, res) => {
    let { cart } = req;
    await cart.remove();
    res.json({ success: true, deletedCart: cart, deleted: true });
  });

module.exports = router;
