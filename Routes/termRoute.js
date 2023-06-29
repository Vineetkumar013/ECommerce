const express = require('express'); 
const terms = require('../Controller/termCtrl');


const router = express();


router.post('/add', [  terms.addterms]);
router.get('/', [  terms.getterms]);
router.put('/:id',[ terms.updateterms]);
router.delete('/:id',[  terms.DeleteTerms]);

module.exports = router;