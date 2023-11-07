const express = require('express')
const router = express.Router();
const Product = require("../models/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../models/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const { isSeller, isAuthenticated, isAdmin } = require('../middleware/auth');
const Order = require('../models/order');
var csv = require("csvtojson");


// create product 
router.post("/create-product", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId)
    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid", 400))
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData)

      res.status(201).json({
        success: true,
        product
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))

// get all products of a shop 
router.get("/get-all-products-shop/:id", catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      products,
    })
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))

// delete product of a shop 
router.delete("/delete-shop-product/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found with this id!", 500))
    }

    res.status(201).json({
      success: true,
      message: "product deleted successfully!"
    })

  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))



// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//  review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      console.log(req.body)

      const product = await Product.findById(productId);

      console.log("pr", product)

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      console.log("p", product.reviews)
      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
      product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


router.post('/upload-csv/:id', upload.single('csv'), async (req, res) => {

  if (!req.file) {
    res.status(400).json({
      message: 'No file uploaded!'
    });
    return;
  }

  const csvFilePath = req.file.path;
  const shopId = req.params.id;
  const shop = await Shop.findById(req.params.id)

  csv()
    .fromFile(csvFilePath)
    .then(async function (jsonArrayObj) {
      try {
        for (const productData of jsonArrayObj) {

          const images = productData.images
            ? productData.images.split(',').map((image) => image.trim())
            : [];

          const product = new Product({
            shopId: shopId,
            name: productData.name,
            description: productData.description,
            category: productData.category,
            tags: productData.tags,
            originalPrice: productData.originalPrice,
            discountPrice: productData.discountPrice,
            stock: productData.stock,
            images: images,
            ratings: 0,
            shop: shop,
            sold_out: 0
          });

          await product.save();
        }

        res.status(200).json({
          message: 'CSV file uploaded and products saved successfully!'
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'An error occurred while saving the products.'
        });
      }
    });
});

module.exports = router;