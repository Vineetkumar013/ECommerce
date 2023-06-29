const Coupon = require("../Model/couponModel");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const moment = require("moment");
const orderModel = require("../Model/ShoppingCartOrderModel");

exports.createCoupon = async (req, res, next) => {
  try {
      console.log("enetred create coupon");
    const couponExists = await Coupon.findOne({
      couponCode: req.body.couponCode,
    });

    if (couponExists) {
      return next(new ErrorHander("coupon with code already exists", 400));
    }

    req.body.activationDate = req.body.activationDate || new Date(moment().format("YYYY-MM-DD"));

    if (
      !moment(new Date()).isSameOrBefore(req.body.activationDate, "day") ||
      !moment(req.body.expirationDate).isAfter(req.body.activationDate, "day")
    ) {
        return next(new ErrorHander("invalid activation or expiration date", 400));
    }

    const coupon = await Coupon.create(req.body);

    return res.status(200).json({
        success: true,
        msg: "coupon created",
        coupon
    })
  } catch (error) {
    next(error);
  }
};

exports.getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({});

        return res.status(200).json({
            success: true,
            msg: "coupons",
            coupons
        })
    } catch(error) {
        next (error);
    }
}

exports.getActiveCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({
            expirationDate: {$gte: new Date(moment().format("YYYY-MM-DD"))},
            activationDate: {$lte: new Date(moment().format("YYYY-MM-DD"))}
        })

        return res.status(200).json({
            success: true,
            msg: "active coupons",
            coupons
        })
    } catch (error) {
        next (error);
    }
}

exports.deleteCoupon = async (req, res, next) => {
    try {
        await Coupon.findByIdAndDelete(req.params.couponId);

        return res.status(200).json({
            msg: "coupon deleted"
        })
    } catch (error) {
        next (error);
    }
}