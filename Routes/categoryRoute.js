const {
  createCategory,
  updateCategory,
  getCategory,
  getallCategory,
  deleteCategory,
  removeCategory,
  createSubCategory,
  TotalCategory
} = require("../Controller/categoryCtrl");


const router = require("express").Router();

router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.get("/:id", getCategory);
router.get("/", getallCategory);
router.delete("/delete/:id", deleteCategory);
router.delete("/delete/:id", removeCategory);
router.post("/subcategory", createSubCategory);
router.get("/totalcategory", TotalCategory);


module.exports = router;  