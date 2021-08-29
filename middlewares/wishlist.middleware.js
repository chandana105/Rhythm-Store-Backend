const { Wishlist } = require('../models/wishlist.model.js')

const findWishListByUserId = async (req, res, next) => {
  const user = req.user
  const { userId } = user
  try {
    const wishlist = await Wishlist.findOne({ userId: userId }).populate('wishlist.product');
    if (!wishlist) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get the wishlist, Please check the userId again.",
      });
    }
    req.wishlist = wishlist;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your userId again" });
  }
}


const findWishItemById = async (req, res, next, wishlistItemId) => {
  try {
    const wishlistItem = await req.wishlist.wishlist.find((productId) => productId._id == wishlistItemId);
    if (!wishlistItem) {
      return res.status(400).json({ success: false, message: 'This wishlist item doesn\'t exist. Please check with your wishlistItemId again.' })
    }
    req.wishlistItem = wishlistItem;
    next()
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", errorMessage: err.message })
  }
}



module.exports = { findWishListByUserId, findWishItemById }
