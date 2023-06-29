const express = require("express");
const {
  registerVender,
  venderLogin,
  createProduct,
  getVenderDetails,
  changeVenderStatus,
  updateVender,
  singleVenderProducts,
  DeleteVendor,
  getAllVender, 
  updateVenderByAdmin,
  registerVenderByAdmin
} = require("../Controller/VenderCtrl");
const { isAuthenticatedUser, authorizeRoles } = require("../Middleware/auth");

const router = express.Router();

router.route("/register").post(registerVender);

router.route("/login").post(venderLogin);

router.route('/all').get(getAllVender)

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("vender"), createProduct);

router
  .route("/products")
  .get(isAuthenticatedUser, authorizeRoles("vender"), singleVenderProducts);

router
  .route("/:id")
  .get(isAuthenticatedUser, authorizeRoles("vender"), getVenderDetails)
  .put(isAuthenticatedUser, authorizeRoles("vender"), updateVender);


router.route('/add')
.post(isAuthenticatedUser, authorizeRoles("admin" ), registerVenderByAdmin)

//router.route('/all').get(isAuthenticatedUser, authorizeRoles('admin'), getAllVender)

router
  .route("/status/:id")
  .put(changeVenderStatus)
  .patch(  updateVenderByAdmin)
  .delete(  DeleteVendor)
module.exports = router;
