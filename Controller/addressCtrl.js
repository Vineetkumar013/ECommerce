const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const Address = require("../Model/addressModel");

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user._id)
  req.body.user = req.user._id;
  const address = await Address.create(req.body);
  res.status(201).json({
    success: true,
    address,
  });
});

exports.getAddressById = catchAsyncErrors(async (req, res, next) => {
  const allAddress = await Address.find({ user: req.user._id });
  res.status(201).json({
    success: true,
    allAddress,
  });
});

exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
  const newAddressData = req.body;

  await Address.findByIdAndUpdate(req.params.id, newAddressData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorHander(`Address does not exist with Id: ${req.params.id}`, 400)
    );
  }
  await address.remove();
  res.status(200).json({
    success: true,
    message: "Address Deleted Successfully",
  });
});
