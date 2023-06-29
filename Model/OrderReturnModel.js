const mongoose = require('mongoose');

const orderReturn = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        require: false
    }, 
    orderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        require: true
    }
})

const OrderReturn = mongoose.model('orderreturn', orderReturn);

module.exports = OrderReturn