const Order = require("../Model/ShoppingCartOrderModel");
const Product = require("../Model/productModel");
const Cart = require("../Model/cartModel");
const Vender = require("../Model/VendorModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const Razorpay = require("razorpay");
const OrderReturn = require('../Model/OrderReturnModel')

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_8VsYUQmn8hHm69",
  key_secret: "Xcg3HItXaBuQ9OIpeOAFUgLI",
});
// Create new Order
// const newOrder = catchAsyncErrors(async (req, res, next) => {
//   const {
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   // const productIds = orderItems.map((order) => order.product);
//   // let venders = []

//   // for (let i = 0; productIds.length > 0; i++) {
//   //   const product = await Product.findById(productIds[i]);
//   //   const vender = await Vender.aggregate([
//   //     { $match: { _id: product.user } },
//   //     { $project: { _id: 1 } },
//   //   ]);

//   // }

//   const order = await Order.create({
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     paidAt: Date.now(),
//     user: req.user._id,
//   });

//   res.status(201).json({
//     success: true,
//     order,
//   });
// });

// // get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate({path: 'user', options: {strictPopulate: true}})

  let totalAmount = 0;

  orders.forEach((orders) => {
    totalAmount += orders.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//get all Orders - Vender
const getAllOrdersVender = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      $project: {
        orderItems: {
          $filter: {
            input: "$orderItems",
            as: "newOrderItems",
            cond: { "$$newOrderItems.venderId": req.user._id },
          },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    orders,
  });
});

// update Order Status -- Admin
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id);
    await order.save();
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Order successfully updated"
  });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
  
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// // delete Order -- Admin
// const deleteOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   await order.remove();

//   res.status(200).json({
//     success: true,
//   });
// });

const checkout = async (req, res, next) => {
  try {
    await Order.findOneAndDelete({
      user: req.body.user,
      orderStatus: "unconfirmed",
    });

    const { address } = req.body;

    let cart = await Cart.findOne({ user: req.body.user })
      .populate({
        path: "products.product",
        select: { review: 0 },
      })
      .populate({
        path: "coupon",
        select: "couponCode discount expirationDate",
      });

    if (!cart) {
      return res.status(400).json({
        success: false,
        msg: "Cart not found or empty.",
      });
    }

    const order = new Order({ user: req.body.userId, address });

    let grandTotal = 0;

    const orderProducts = cart.products.map((cartProduct) => {
      const total = cartProduct.quantity * cartProduct.product.price;
      grandTotal += total;
      return {
        product: cartProduct.product._id,
        unitPrice: cartProduct.product.price,
        quantity: cartProduct.quantity,
        total,
      };
    });

    order.products = orderProducts;

    if (cart.coupon) {
      order.coupon = cart.coupon._id;
      order.discount = 0.01 * cart.coupon.discount * grandTotal;
    }

    order.grandTotal = grandTotal;
    order.shippingPrice = 10;
    order.amountToBePaid = grandTotal + order.shippingPrice - order.discount;

    await order.save();

    await order.populate([
      { path: "products.product", select: { reviews: 0 } },
      {
        path: "coupon",
        select: "couponCode discount expirationDate",
      },
    ]);

    return res.status(200).json({
      success: true,
      msg: "Order created",
      order,
    });
  } catch (error) {
    next(error);
  }
};


const placeOrder = async (req, res, next) => {
  try {
    const userId = req.body.user;

    // Check if there is an unconfirmed order for the user
    // const unconfirmedOrder = await Order.findOne({
    //   user: userId,
    //   orderStatus: "unconfirmed",
    // });

    // if (unconfirmedOrder) {
    //   return res
    //     .status(400)
    //     .json({ msg: "There is already an unconfirmed order for this user." });
    // }

    // Fetch user's cart or create a new one
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ msg: "There are no products in the user's cart." });
    }

    // Calculate order total, including discounts and shipping price
    const { grandTotal, discount, shippingPrice } = calculateOrderTotal(
      cart.products
    );

    // Create a new order
    const newOrder = new Order({
      user: userId,
      products: cart.products,
      grandTotal,
      discount,
      shippingPrice,
      amountToBePaid: grandTotal,
      orderStatus: "unconfirmed",
    });

    // Save the new order
    await newOrder.save();

    // Create payment options for the payment gateway
    const orderOptions = {
      amount: grandTotal * 100, // Convert to the required currency's smallest unit (e.g., paise)
      currency: "INR",
    };

    // Create a payment gateway order
    const paymentGatewayOrder = await razorpayInstance.orders.create(
      orderOptions
    );

    // Update the new order with the payment gateway order ID and status
    newOrder.paymentGatewayOrderId = paymentGatewayOrder.id;
    newOrder.orderStatus = "confirmed";
    await newOrder.save();

    return res.status(200).json({
      msg: "Order placed successfully",
      orderId: paymentGatewayOrder.id,
      amount: orderOptions.amount,
    });
  } catch (error) {
    console.log(error);
    //next(error);
  }
};

const calculateOrderTotal = (products) => {
  let grandTotal = 0;
  let discount = 0;
  let shippingPrice = 0;

  // Perform calculations based on your requirements
  // You can iterate over the products array and calculate the total, discounts, and shipping price

  return { grandTotal, discount, shippingPrice };
};


const placeOrderCOD = async (req, res, next) => {
  try {
    console.log(req.body.user)
    const order = await Order.findOne({
      user: req.body.user,
      orderStatus: "unconfirmed",
    });
    console.log(order)
    
    const amount = order.amountToBePaid;

    const orderOptions = {
      amount: amount * 100,
      currency: "INR",
    };
    console.log(orderOptions);

    // const paymentGatewayOrder = await razorpayInstance.orders.create(
    //   orderOptions
    // );

    order.paymentGatewayOrderId = "Cash"
    order.orderStatus = "confirmed";
    await order.save();

    return res.status(200).json({
      msg: "order id",
    //  orderId: paymentGatewayOrder.id,
      amount: amount * 100,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
      orderStatus: "confirmed",
    }).populate({
      path: "products.product",
      select: {
        reviews: 0
      }
    }).populate({
      path: "coupon",
      select: "couponCode discount expirationDate"
    });
    console.log(`user=${user}`)

    return res.status(200).json({
      success: true,
      msg: "orders of user",
      orders
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};


const orderReturn =  async(req,res) => {
  try{
  const orderId = req.params.id;
  const data = await Order.findOne({_id: orderId});
  if(!data){
    return res.status(500).json({
      message: "OrderId is Not present "
    })
  }else{
    const Data = {
      user: data.user,
      orderId: orderId
    }
    const returnData = await OrderReturn.create(Data);
    if(returnData){
      await Order.findByIdAndDelete({_id: orderId});
      res.status(200).json({
        details: returnData
      })
    }
  }
  }catch(err){
    res.status(400).json({
      message: err.message
    })
  }
}

const GetAllReturnOrderbyUserId = async(req,res) => {
  try{
 const data = await  OrderReturn.find({user: req.params.userId});
 if(data.length == 0 ){
  return res.status(500).json({
    message: "No Return list found  this user "
  })
 }else{
  res.status(200).json({
    message: data
  })
 }
  }catch(err){
    console.log(err);
    res.status(400).json({
      message:err.message
    })
  }
}

const AllReturnOrder = async(req,res) => {
  try{
  const data = await OrderReturn.find();
  res.status(200).json({
    message: data
  })
  }catch(err){
    console.log(err);
    res.status(400).json({
      message: err.message
    })
  }
}

const GetReturnByOrderId = async(req,res) => {
  try{
  const data = await OrderReturn.findOne({orderId: req.params.id});
  if(!data){
    return res.status(500).json({
      message: "No Data Found "
    })
  }
  res.status(200).json({
    message: data
  })
  }catch(err){
    res.status(400).json({
      message: err.message
    })
  }
}

// const getAllOrders = catchAsyncErrors(async (req, res, next) => {
//   const orders = await Order.find().populate({path: 'user', options: {strictPopulate: true}})

//   let totalAmount = 0;

//   orders.forEach((order) => {
//     totalAmount += order.totalPrice;
//   });

//   res.status(200).json({
//     success: true,
//     totalAmount,
//     orders,
//   });
// });


module.exports = {
  getSingleOrder,
  myOrders,
  getAllOrders,
  getAllOrdersVender,
  updateOrder,
  checkout,
  placeOrder,
  placeOrderCOD,
  getOrders,
  orderReturn,
  GetAllReturnOrderbyUserId,
  AllReturnOrder,
  GetReturnByOrderId
}