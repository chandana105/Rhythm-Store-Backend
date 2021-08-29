const { Cart } = require('../models/cart.model.js')

const findCartByUserId = async (req, res, next) => {
  const user = req.user
  const { userId } = user
  try {
    const cart = await Cart.findOne({ userId: userId }).populate('cartList.product');
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get the cart, Please check the userId again.",
      });
    }
    req.cart = cart;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your userId again" });
  }
}


const findCartItemById = async (req, res, next, cartItemId) => {
  try {
    const cartItem = await req.cart.cartList.find((product) => product._id == cartItemId);
    if (!cartItem) {
      return res.status(400).json({ success: false, message: 'This cart item doesn\'t exist. Please check with your cartItemId again.' })
    }
    req.cartItem = cartItem;
    next()
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", errorMessage: err.message })
  }
}


module.exports = { findCartByUserId, findCartItemById }



// req.cart.cartList.find((productId) => console.log({productId}));

  // console.log(typeof(cartItemId) , '1') //string

// eq.cart.cartList.find((productId) => console.log(typeof(productId._id) , '2')); // object

// therfore triple equls was not wrkign here
    // const cartItem = await req.cart.cartList.find((productId) => productId._id === cartItemId);