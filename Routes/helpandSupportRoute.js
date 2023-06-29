const express = require('express');
const help = require('../Controller/helpandSupportCtrl');
const auth = require('../Middleware/auth');


const router = express();

router.post('/',auth.isAuthenticatedUser, help.AddQuery);
router.get('/', help.getAllHelpandSupport);
router.get('/user', auth.isAuthenticatedUser, help.getAllHelpandSupportgetByuserId);
router.delete('/delete/:id', help.DeleteHelpandSupport);

module.exports = router;