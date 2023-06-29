const ErrorHander = require("../utils/errorhander");
// const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

exports.isAuthenticatedUser = /* catchAsyncErrors( */async (req, res, next) => {
  try {
    const token = req.get("Authorization")?.split("Bearer ")[1];
    console.log(token)
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedData);
  req.user = await User.findById(decodedData.id);
  console.log(req.user)
  next();
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}/* ) */;

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};

exports.authorizeRolesVendor = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};