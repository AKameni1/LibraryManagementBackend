const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

router.post('/', faqController.createFAQ);
router.get('/', faqController.getAllFAQs);
router.get('/:id', faqController.getFAQById);
router.put('/:id', faqController.updateFAQ);
router.delete('/:id', faqController.deleteFAQ);

module.exports = router;
