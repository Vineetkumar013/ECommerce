const mongoose = require("mongoose"); 

const termsSchema = mongoose.Schema({
    terms: {
        type: String
    }
})



const terms  = mongoose.model('terms', termsSchema);

module.exports = terms