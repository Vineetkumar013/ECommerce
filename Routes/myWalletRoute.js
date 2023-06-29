const {
  addMoney,
  getWallet,
  deleteWallet
} = require("../Controller/myWalletCtrl");

const router = require("express").Router();

router.put("/addmoney/:id", addMoney);
router.get("/:id", getWallet);
router.delete("/:id", deleteWallet);

module.exports = router;