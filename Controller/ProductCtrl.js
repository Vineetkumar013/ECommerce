const Product = require("../Model/productModel");
const cloudinary = require('cloudinary').v2;
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const Wishlist = require("../Model/WishlistModel");
const mongoose = require("mongoose");
const ErrorHander = require("../utils/errorhander");
const ApiFeatures = require("../utils/apifeatures");


cloudinary.config({
  cloud_name: "dvwecihog",
  api_key: '364881266278834',
  api_secret: '5_okbyciVx-7qFz7oP31uOpuv7Q'
}); 


// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  let leaselistingPicture = []
  if (req.files.length > 0) {
    leaselistingPicture = req.files.map((file) => {
      return { path: file.path, filename: file.filename  };
    });
  }

  const uploadPromises = leaselistingPicture.map(async (image) => {
    const result = await cloudinary.uploader.upload(image.path, {public_id: image.filename});
    return result
  });
 const Images =  await Promise.all(uploadPromises);
 for(var i=0 ; i<Images.length; i++){
  images.push({img: Images[i].url})
 }
  const  data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    ratings: req.body.ratings,
    images,
    size: req.body.size,
    colors: req.body.colors,
    category: req.body.category,
    Stock: req.body.Stock, 
    numOfReviews: req.body.numOfReviews,
    user: req.body.user,
    reviews: req.body.review
  }
  const product = await Product.create(data);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 50;
  const productsCount = await Product.countDocuments();
  let demoProduct = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        ratings: 1,
        review: 1,
        category: "$category.parentCategory",
      },
    },
  ]);

  const apiFeature = new ApiFeatures(
    Product.find().populate("category"),
    req.query
  )
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  res.status(200).json({
    success: true,
    products,
    demoProduct,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find().populate("category");

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  try{
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  console.log(req.body.images)
  let images = [];

  if (req.body.images) {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  // if (images !== undefined) {
  //   // Deleting Images From Cloudinary
  //   for (let i = 0; i < product.images.length; i++) {
  //     await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  //   }

  //   const imagesLinks = [];

  //   for (let i = 0; i < images.length; i++) {
  //     const result = await cloudinary.v2.uploader.upload(images[i], {
  //       folder: "products",
  //     });

  //     imagesLinks.push({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   }

  //   req.body.images = imagesLinks;
  // }

  product = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
}catch(err){
  console.log(err);
  res.status(400).json({
    message: err.message
  })
}
});
// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById({_id: req.params.id});

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Your review has been saved.',
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});


exports.createWishlist = catchAsyncErrors(async (req, res, next) => {
  const  product  = req.params.id;
  //console.log(user)
  let wishList = await Wishlist.findOne({ user: req.user._id });
  if (!wishList) {
    wishList = new Wishlist({
      user: req.user,
    });
  }
  wishList.products.addToSet(product);
  await wishList.save();
  res.status(200).json({
    message: "product addedd to wishlist Successfully",
  });
});

exports.removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return next(new ErrorHander("Wishlist not found", 404));
  }
  const product  = req.params.id;

  wishlist.products.pull(new mongoose.Types.ObjectId(product));

  await wishlist.save();
  res.status(200).json({
    success: true,
    message: "Removed From Wishlist",
  });
});


exports.myWishlist = catchAsyncErrors(async (req, res, next) => {
  let myList = await Wishlist.findOne({ user: req.user._id }).populate(
    "products"
  );

  if (!myList) {
    myList = await Wishlist.create({
      user: req.user._id,
    });
  }
  res.status(200).json({
    success: true,
    wishlist: myList,
  });
});

exports.getProductByCategory =  catchAsyncErrors(async (req,res,next) => {
  try{
    const producyBycategory = await Product.find({category:req.params.id})
      
      res.status(200).json({
        message:"get Successfully",
        data:producyBycategory
      })

  }catch(error){
    res.status(500).json({
      message:error.message
    })
  }
})