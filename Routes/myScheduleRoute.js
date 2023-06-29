const {
  orderSchedule,
  getSchedule
} = require("../Controller/myScheduleCtrl");

const router = require("express").Router();

router.post("/order/:userId", orderSchedule);
router.get("/order/:id", getSchedule);

module.exports = router;