const express = require('express');
const router = express.Router();
const ticketResponseController = require('../controllers/ticketResponseController');

router.post('/', ticketResponseController.createResponse);
router.get('/:ticketId', ticketResponseController.getResponsesByTicket);

module.exports = router;
