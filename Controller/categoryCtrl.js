const Category = require("../Model/categoryModel");
const SubCategory = require("../Model/SubCategoryModel");

const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

////////////////////////////////////////// CREATE CATEGORY  //////////////////////////////////

const createCategory = catchAsyncErrors(async (req, res, next) => {
  // const imagesLinks = await singleFileHandle(req.file,req);

    // const name = req.file ? req.file.filename : null;
    //  req.body.image = `${process.env.IMAGE_BASE_URL}/${req.file.filename}`
  const data = {
    name: req.body.name, 
    image: req.body.image
  }
  console.log(data)
  const category = await Category.create(data);
  res.status(201).json({
    success: true,
    category,
  });
});

////////////////////////////////////////// UPDATE CATEGORY  //////////////////////////////////

const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) new ErrorHander("Category Not Found !", 400);

  category.name = req.body.name;
  category.image = req.body.image
  await category.save();

  res.status(200).json({ message: "Updated Successfully" });
});

////////////////////////////////////////// DELETE CATEGORY  //////////////////////////////////

const deleteCategory = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
      await SubCategory.deleteMany({parentCategory: req.params.id});
  res.status(200).json({
    message: "Deleted Successfully"
  })
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

////////////////////////////////////////// REMOVE CATEGORY  //////////////////////////////////

const removeCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) new ErrorHander("Category Not Found !", 404);

  const subCategory = await SubCategory.find({ parentCategory: id });

  subCategory.map(
    async (item) => await SubCategory.deleteOne({ _id: item.id })
  );

  category.remove();

  res.status(200).json({ message: "Category Deleted Successfully !" });
});

////////////////////////////////////////// GET CATEGORY  //////////////////////////////////

const getCategory = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
});

////////////////////////////////////////// GET ALL CATEGORY  //////////////////////////////////

const getallCategory = catchAsyncErrors(async (req, res) => {
  try {
    const getallCategory = await Category.find();
  res.status(201).json({
    success: true,
    categories,
  });
  } catch (error) {
    throw new Error(error);
  }
});

////////////////////////////////////////// CREATE SUB-CATEGORY  //////////////////////////////////

const createSubCategory = catchAsyncErrors(async (req, res, next) => {
 // const name = req.file ? req.file.filename : null;
  // try {
  //   // req.body.image = `${process.env.IMAGE_BASE_URL}/${req.file.filename}`
  //     const data = {
  //   name: req.body.name, 
  //   image: req.body.image
  // }
  //   console.log(req.body.image);
  // const subCategory = await SubCategory.create(req.body);
  // res.status(201).json({
  //   success: true,
  //   subCategory,
  // });
  // } catch (error) {
  //     console.log(error);
  //     res.status(400).json({
  //     message: error.message
  //   })
  // }
  
    try {
    const { parentCategory, subCategory, image } = req.body;

    // Check if the subcategory already exists
    const existingSubCategory = await SubCategory.findOne({ subCategory });
    if (existingSubCategory) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    const newSubCategory = new SubCategory({
      parentCategory,
      subCategory,
      image,
    });

    // Save the new subcategory to the database
    const createdSubCategory = await newSubCategory.save();

    res.status(201).json({
      success: true,
      subCategory: createdSubCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

////////////////////////////////////////// TOTAL CATEGORY  //////////////////////////////////

const TotalCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const data = await Category.find();
    res.status(200).json({
      total: data.length,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = {
  createCategory,
  updateCategory,
  removeCategory,
  deleteCategory,
  getCategory,
  getallCategory,
  createSubCategory,
  TotalCategory
}