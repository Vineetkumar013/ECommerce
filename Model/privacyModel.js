const mongoose = require("mongoose"); 

const policySchema = mongoose.Schema({
    privacy: {
        type: String
    }
})



const policy  = mongoose.model('policy', policySchema);

module.exports = policy;