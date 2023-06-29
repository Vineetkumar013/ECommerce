const AboutUs = require("../Model/aboutUsModel");
// const { createResponse } = require("../utils/response");

// Get the about us information
const create = async (req, res) => {
    try {
        const aboutUs = await AboutUs.create(req.body);
        return res.status(200).json("About us create successfully", aboutUs);
      
    } catch (err) {
        console.error(err);
        return res.status(500).json( "Server error");
    }
};
const getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.find().lean();
        if (!aboutUs) {
            return res.status(404).json( "About us not found");
        }
        return createResponse(
            res,
            200,
            "About us retrieved successfully",
            aboutUs[aboutUs.length - 1]
        );
    } catch (error) {
        console.error;
        return res.status(500).json( "Internal server error");
    }
};

// Update the about us information
const updateAboutUs = async (req, res) => {
    const { imageUrl, title, content } = req.body;
    try {
        const aboutUs = await AboutUs.findOne();
        if (!aboutUs) {
            return res.status(404).json("About us not found");
        }
        aboutUs.title = title || aboutUs.title;
        aboutUs.content = content || aboutUs.content;
        if (imageUrl && imageUrl !== aboutUs.imageUrl) {
            aboutUs.imageUrl = imageUrl || aboutUs.imageUrl;
        }
        const updatedAboutUs = await aboutUs.save();
        return res.status(200).json(
            "About us updated successfully",
            updatedAboutUs
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json( "Internal server error");
    }
};
const deleteAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findByIdAndDelete(req.params.id);
        if (!aboutUs) {
            res.status(404).json( "About us not found");
        } else {
            res.status(200).json( "About us deleted successfully");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json( "Server error");
    }
};

module.exports = { create, getAboutUs, updateAboutUs, deleteAboutUs };
