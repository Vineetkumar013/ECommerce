const ErrorHander = require("../utils/errorhander");
const admin = require('../Model/admin')
const bcrypt = require('bcryptjs')
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const Brand = require("../Model/brandModel");
const { multipleFileHandle } = require("../utils/fileHandle");

exports.createBrand = catchAsyncErrors(async (req, res, next) => {
  const imagesLinks = await multipleFileHandle(req.files);

  req.body.brandIcon = imagesLinks[0];

  req.body.user = req.user.id;

  const category = await Brand.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});


// exports.RegisterAdmin = catchAsyncErrors(async(req,res, next) => {
//   try{
//     const data = {
//       name: req.body.name, 
//       email: req.body.email, 
//       password: bcrypt.compareSync(req.body.password, 8),
//       role: req.body.role
//     }
//     const result = await admin.create(data);
//     res.status(200).json({
//       message: "ok", 
//       result: result 
//     })
//   }catch(err){
//     console.log(err);
//     res.status(400).json({
//       message: "not ok", 
//       error: err.message
//     })
//   }
 
// })

// exports.Login = catchAsyncErrors(async(req,res, next) => {
//   try{
//     const email = req.body.email;
//     const password  = req.body.password; 

//   }catch(err){
//     console.log(err);
//     res.status(400).json({
//       message: "not ok", 
//       error: err.message
//     })
//   }
// })
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {});

exports.updateBrand = catchAsyncErrors(async (req, res, next) => {});
