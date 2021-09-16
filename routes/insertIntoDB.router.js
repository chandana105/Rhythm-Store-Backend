const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model.js");
const { productList } = require("../data/product-data.js");

const { Category } = require('../models/category.model.js');
const { categoryList } = require('../data/category-data.js')

const { Genre } = require('../models/genre.model.js');
const { genreList } = require('../data/genre-data.js')



router.route("/products").get(async (_, res) => {
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
        genre: product.genre
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


router.route('/categories')
  .get(async (req, res) => {
    try {
      categoryList.forEach(category => {
        productList.forEach(async product => {
          const isProductPresent = await Product.findOne({ name: product.name })
          if (!isProductPresent) return;
          isProductPresent.genre.forEach(name => {
            if (name === category.name) {
               category.products.push(isProductPresent._id)
            }
          })
        })
      })
      const savedCategories = await Category.insertMany(categoryList);
      res.json({
        success: true, message: "Categories are inserted into DB",
        savedCategories
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to insert all the categories",
        errorMessage: err.message
      })
    }
  })

router.route('/genres')
  .get(async (req, res) => {
    try {
      genreList.forEach(genre => {
        productList.forEach(async product => {
          const isProductPresent = await Product.findOne({ name: product.name })
          if (!isProductPresent) return;
          isProductPresent.genre.forEach(name => {
            if (name === genre.name) {
               genre.products.push(isProductPresent._id)
            }
          })
        })
      })
      const savedGenres = await Genre.insertMany(genreList);
      res.json({
        success: true, message: "genres are inserted into DB",
        savedGenres
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to insert all the Genres",
        errorMessage: err.message
      })
    }
  })


module.exports = router;


// categoryList.forEach(category => {
//       console.log({category})
//     })
//     { category: { name: 'Musical Instruments', products: [] } }....
// ab for each category to check ki kya yeh categroey.name is in prodcuts.genre mein? if yes toh add the id of the rpdocut to that category.products ke arr mein , before that ll cehc kki kya productlist mein jo prducth ia vo mongodb eproductslist mei nhai ki mhi agr hai, then genre ads and so on


// frst checked ki jo productdata hai ie productsdarta.js usme jo prodcut hai kya vo mongodb ke prodcuts mein hai ki hi, agr hai means it is there ,ie its already saved, else mongodb mein jo prdocut traerse krrhe hain save it to db 