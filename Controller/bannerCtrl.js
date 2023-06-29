const banner = require('../Model/bannerModel')



exports.AddBanner = async (req, res) => {
    try {
        const data = {
            image: req.body.image,
            desc: req.body.desc
        }
        const Data = await banner.create(data);
        res.status(200).json({
            message: "Banner is Addded ",
            data: Data
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getBanner = async (req, res) => {
    try {
        const Banner = await banner.find();
        res.status(200).json({
            message: "All Banners",
            data: Banner
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getById = async (req, res) => {
    try {
        const Banner = await banner.findById({ _id: req.params.id });
        res.status(200).json({
            message: "One Banners",
            data: Banner
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.DeleteBanner = async(req,res) => {
    try{
        const Banner = await banner.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({
            message: "Delete Banner ",
        },)
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}