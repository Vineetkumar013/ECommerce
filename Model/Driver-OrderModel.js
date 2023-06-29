const mongoose = require('mongoose');



const DriverOrders = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order",
        require: [true, "OrderId is Required "]
    },
    driverId : {
        type:  mongoose.Schema.Types.ObjectId, 
        ref: "driver", 
        require: [true, "DriverID is required "]
    },
    // driver: {
    //     type: Object
    // },
    image: {
        type: String
    },
    returnitem: {
        type: Boolean, 
        default: false
    },
    useraddress: {
        type: Object
    },
    order: {
        type: Object
    }, 
    status: {
        type: String,
        default: "pending",
        enum : ["Accept", "accept", "Reject", "reject", "pending"]
    }, 
    orderStatus : {
        type: String, 
        default: "pending",
    }, 
    price: {
        type: String, 
        require: false
    },  
    takenOrder: {
    type: String
    }, 
    pickuporder: {
        type: String
    },
    payment: {
        type: String
    }, 
    username: {
        type: String
    },
    userMobile: {
        type: String
    }
})


const deiverOrder = mongoose.model('driverOrder', DriverOrders);

module.exports = deiverOrder