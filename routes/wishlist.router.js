const express = require("express");
const router = express.Router();
const { Wishlist } = require('../models/wishlist.model.js')
const { extend, concat } = require("lodash");
const { findWishListByUserId, findWishItemById } = require('../middlewares/wishlist.middleware.js')

const addToWishlist = async (req, res, next) => {
  let { user } = req;
  let { userId } = user;
  const { wishlistUpdate } = req.body;
  try {
    let wishlistExist = await Wishlist.findOne({ userId: userId });
    wishlistUpdate.wishlist[0]._id = wishlistUpdate.wishlist[0].product;
    if (wishlistExist) {
      wishlistExist.wishlist = concat(wishlistExist.wishlist, wishlistUpdate.wishlist);
      await wishlistExist.save()
      return next();
    } else {
      const NewWishlist = await Wishlist({ userId: userId, wishlist: wishlistUpdate.wishlist });
      await NewWishlist.save();
      return next();
    }
  } catch (err) {
    console.log('adding to wishlist ', err)
  }
}


router.route('/userId')
  .get(findWishListByUserId, async (req,res) => {
    const {wishlist} = req;
    res.json({ success: true, wishlist })
  })
  .post(addToWishlist, async (req, res) => {
    let { user } = req;
    let { userId } = user;
    try {
      const wishlist = await Wishlist.findOne({ userId: userId }).populate('wishlist.product');
      res.json({ success: true, wishlist })
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: err.message })
    }
  })
  .delete(findWishListByUserId, async (req, res) => {
    const { wishlist } = req;
    const deletedWishlist = await wishlist.remove();
    res.json({ success: true, deleted: true, deletedWishlist })
  })

  router.use(findWishListByUserId)

  router.param('wishlistItemId' , findWishItemById ) 

  router
  .route("/userId/:wishlistItemId")
  .get((req, res) => {
    let { wishlistItem } = req;
    res.json({ success: true, wishlistItem });
  })


  .delete(async (req, res) => {
    let { wishlistItem, wishlist } = req;
    await wishlistItem.remove();
    await wishlist.save()
    res.json({ success: true, deletedWishlistItem: wishlistItem, deleted: true });
  });



module.exports = router  