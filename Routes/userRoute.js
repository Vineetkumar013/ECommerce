const {
  registerUser,
  registerEmailUser,
  UpdatePhoneUser,
  loginUser,
  getAllUser,
  getUserbyId,
  deleteUser,
  verifyOTP
} = require("../Controller/userCtrl");

const router = require("express").Router();

router.post("/create", registerUser);
router.put("/email/:id", registerEmailUser);
router.put("/mobile/:id", UpdatePhoneUser);
router.post("/login", loginUser);
router.get("/", getAllUser);
router.get("/:id", getUserbyId);
router.delete("/:id", deleteUser);
router.post("/verify-otp/:id", verifyOTP);

module.exports = router;