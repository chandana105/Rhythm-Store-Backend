const express = require("express");
const router = express.Router();
const { Cart } = require('../models/cart.model.js')
const { extend, concat } = require("lodash");
const { findCartByUserId, findCartItemById } = require('../middlewares/cart.middleware.js')


const addToCart = async (req, res, next) => {
  let { user } = req;
  let { userId } = user;
  const { cartListUpdate } = req.body;
  try {
    let cartExist = await Cart.findOne({ userId: userId });
    cartListUpdate.cartList[0]._id = cartListUpdate.cartList[0].product;
    if (cartExist) {
      cartExist.cartList = concat(cartExist.cartList, cartListUpdate.cartList);
      await cartExist.save();
      return next();
    } else {
      const NewCart = await Cart({ userId: userId, cartList: cartListUpdate.cartList });
      await NewCart.save();
      return next();
    }
  } catch (err) {
    console.log('adding to cart ', err)
  }
}

router
  .route("/userId")
  .get(findCartByUserId, async (req, res) => {
    const { cart } = req;
    res.json({ success: true, cart })
  })
  .post(addToCart, async (req, res) => {
    let { user } = req;
    let { userId } = user;
    try {
      const cart = await Cart.findOne({ userId: userId }).populate('cartList.product');
      res.json({ success: true, cart })
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to add products to Cart", errorMessage: err.message })
    }
  })
  .delete(findCartByUserId, async (req, res) => {
    const { cart } = req;
    const deletedCart = await cart.remove();
    res.json({ success: true, deleted: true, deletedCart })
  })

router.use(findCartByUserId)

router.param("cartItemId", findCartItemById)


router
  .route("/userId/:cartItemId")
  .get((req, res) => {
    let { cartItem } = req;
    res.json({ success: true, cartItem });
  })

  // post mein we ll send qty object to update
  .post(async (req, res) => {
    const cartItemUpdates = req.body;
    let { cartItem, cart } = req;
    cartItem = extend(cartItem, cartItemUpdates);
    await cart.save()
    res.json({ success: true, updatedCartItem: cartItem });
  })

  .delete(async (req, res) => {
    let { cartItem, cart } = req;
    await cartItem.remove();
    await cart.save()
    res.json({ success: true, deletedCartItem: cartItem, deleted: true });
  });

module.exports = router;



