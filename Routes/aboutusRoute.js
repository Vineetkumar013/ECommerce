const router = require("express").Router();
const {
    create,
    getAboutUs,
    updateAboutUs,
    deleteAboutUs,
} = require("../Controller/aboutUsCtrl");

router.post("/", create);
router.get("/", getAboutUs);
router.put("/:id", updateAboutUs);
router.delete("/:id", deleteAboutUs);
module.exports = router;
