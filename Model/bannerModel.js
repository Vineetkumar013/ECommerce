const mongoose = require('mongoose');


const bannerSchema = mongoose.Schema({
    image: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        require: false
    }
})

const banner = mongoose.model('banner', bannerSchema);

module.exports = banner;

