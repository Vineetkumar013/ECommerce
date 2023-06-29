const driver = require('../Model/DriverRegistration');
const order = require('../Model/ShoppingCartOrderModel');
const User = require('../Model/userModel')
const DriverOrder = require('../Model/Driver-OrderModel')
const rejectOrder = require('../Model/RejectReasonsModel')
const address = require('../Model/addressModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otpHelper = require("../utils/OTP-Generate");
const { error } = require('console');
const product = require('../Model/productModel')
const JWTkey = process.env.JWT_SECRET

exports.sendOtp = async (req, res) => {
    try{
      const Data = await driver.findOne({phone: req.body.phone})
      if(!Data){
        const otp = await  otpHelper.generateOTP(4);
        const data =  await driver.create({
            phone: req.body.phone,
           otp: otp,
         });
        return res.status(200).json({
           otp: data.otp,
         })
      }else{
      const otp = await  otpHelper.generateOTP(4);
     const data =  await driver.updateOne({_id: Data._id},{
      otp: otp
      }, {new:true});
      res.status(200).json({
        otp: otp,
      })
    }
    } catch (error) {
        console.log(error);
      throw error;
    }
  }


exports.accountVerificationOTP = async (req, res, next) => {
    try{
    const user = await driver.findOne({
      otp: req.body.otp
    })
  
    console.log("user",user)
    if(!user) {
      return next(new ErrorHander("Invalid OTP!", 400))
    }
   const token =  jwt.sign(
      { user_id: user._id },
      JWTkey,
    );
    res.status(200).json({
      token : token,
      Id : user._id
    })
    
  }catch(err){
    console.log(error)
    res.status(400).json({
      message: err.message
    })
  }
  };

exports.AddDeriverDetails = async(req,res) => {
    try{
const data = {
    Name: req.body.Name, 
    password: bcrypt.hashSync(req.body.password, 8),
    email: req.body.email, 
    image: req.body.image, 
} 
 const Data = await driver.findOne({email: req.body.email})
 if(Data){
    return res.status(201).json({
        message: "Email is Already regtration"
    })
 }else{
    const data = await driver.findOneAndUpdate({_id: req.params.id}, {
        Name: req.body.Name, 
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email, 
        image: req.body.image, 
    }, {new: true});
    res.status(200).json({
        success: true, 
        details : data
    })
 }
}catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

// exports.AddDeriverDetails = async(req,res) => {
//     try{
// const data = {
//     Name: req.body.Name, 
//     password: bcrypt.hashSync(req.body.password, 8),
//     email: req.body.email, 
//     image: req.body.image, 
// } 
//  const Data = await driver.findOne({email: req.body.email})
//  if(Data){
//     return res.status(201).json({
//         message: "Email is Already regtration"
//     })
//  }else{
//     const data = await driver.create(data);
//     res.status(200).json({
//         success: true, 
//         details : data
//     })
//  }
// }catch(err){
//         res.status(400).json({
//             message: err.message
//         })
//     }
// }

exports.AssignOrdertoDriver = async(req,res) => {
    try{
    const orderData = await order.findById({_id: req.body.orderId});
    const productId = orderData.products[0].product;
    console.log(productId)
    const productData = await product.findOne({_id: productId});
    console.log(productData)
    const UserData = await address.find({user: orderData.user})
    const userData = await User.findById({_id: orderData.user})
    console.log(productData.images)
    if(!orderData){
        return res.status(500).json({
            message: "Order not found "
        })
    }else{
        const data = {
            orderId: req.body.orderId, 
            driverId: req.body.driverId,
            image: productData.images[0], 
            order: orderData, 
            price: req.body.price,
            returnitem: req.body.returnitem,
            pickuporder: req.body.dilverdAddress,
            payment: req.body.payment, 
            useraddress: UserData,
            username: userData.name,
            userMobile: userData.phone
        }
        const DOrder = await DriverOrder.create(data);
        res.status(200).json({
            sucess: true,
            message: DOrder
        })
    }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: err.message
        })
    }
}


exports.DriverAccept  = async(req,res) => {
    try{
    const data = await DriverOrder.findOneAndUpdate({_id: req.params.id}, {
        status: "Accept"
    }, {new: true},)
    res.status(200).json({
        message: "Accepted"
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.DriverReject  = async(req,res) => {
    try{
        const Data = await DriverOrder.findById({_id: req.params.id})
        if(!Data){
            return res.status(500).json({message: "Driver_Order ID is not found "})
        }
    const data = await DriverOrder.findOneAndUpdate({_id: req.params.id}, {
        status: "Reject"
    }, {new: true},)
   
   const RData = await rejectOrder.create({
    driverId: Data.driverId, 
    reasons: req.body.reason

   })
    res.status(200).json({
        message: "Reject"
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.DriverAllOrder = async(req,res) => {
    try{
const Data = await DriverOrder.find({driverId: req.params.id});
if(Data.length ==0 ){
    return res.status(201).json({
        message: "No Data Found "
    })
}
res.status(200).json({
    sucess: true,
    message: Data
})
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.DeleteAssignOrder = async(req,res) => {
    try{
    await DriverOrder.findByIdAndDelete({_id: req.params.id});
    res.status(200).json({
        message: "Assign Order Deleted "
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

exports.GetPriceByDriverId = async(req, res) => {
    try{
    const data = await DriverOrder.find({driverId: req.params.driverId});
    console.log(data)
    const Data = data.map(d => {
       return  result = {
            price: d.price, 
            orderId: d._id, 
            products: d.order.products
       }
    })
    let total =0 ; 
    for(let i=0 ; i< Data.length; i++){
        (total) += parseInt(Data[i].price)
    
    }
    console.log(total)
    res.status(200).json({
        message: Data,
        total: total
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.DeliveredOrder = async(req,res) => {
    try{
    await DriverOrder.updateOne({_id: req.params.id}, {
        delivered: true,
        orderStatus: "Deliverd"
    }, {new: true})
    res.status(200).json({
        message: "Delivered "
    })
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: err.message
        })
    }
}

exports.logout = async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  };

exports.AllDrivers = async(req,res) => {
    try{
    const Data = await driver.find() 
    if(Data.length ==0 ){
        return res.status(201).json({
            message: "No Data Found "
        })
    }else{
        return res.status(200).json({
            message: Data
        })
    }
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

exports.driverCompleted = async(req,res) => {
    try{
    const data = await DriverOrder.find({driverId: req.params.driverId, orderStatus: "Deliverd"});
    
    if(data.length ==0 ){
        return res.status(201).json({
            message: "No Delivered Order "
        })
    }else{
        return res.status(200).json({
            message: data
        })
    }
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

exports.PendingOrder = async(req,res) => {
    try{
    const data = await DriverOrder.find({
        $and: [
           {driverId: req.params.id}, 
            {status: "pending"}
        ]
    });
    console.log(data)
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


exports.AcceptOrder = async(req,res) => {
    try{
    const data = await DriverOrder.find({
        $and: [
           {driverId: req.params.id}, 
            {status: "Accept"}
        ]
    });
    console.log(data)
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


exports.ChangeStatus = async(req,res) => {
    try{
    const driverData = await driver.findById({_id: req.params.id})
    driverData.status = req.body.status
    driverData.save();
    res.status(200).json({
        message: "ok",
        result : driverData
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: "ok",
            error: err.message
        })
    }
}

exports.DeleteDriver = async(req, res) => {
    try{
    await driver.findByIdAndDelete({_id: req.params.id});
    res.status(200).json({
        message: "Driver Deleted ",
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: "ok",
            error: err.message
        })
    }
}


