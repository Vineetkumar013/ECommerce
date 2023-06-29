const router = require("express").Router();
const banner = require('../Controller/bannerCtrl')


router.post('/add', banner.AddBanner );
router.get('/all', banner.getBanner);
router.get('/get/:id', banner.getById);
router.delete('/delete/:id', banner.DeleteBanner);



module.exports = router;