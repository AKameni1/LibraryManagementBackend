const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportTicketController');

router.post('/', supportTicketController.createTicket);
router.get('/', supportTicketController.getAllTickets);
router.get('/:id', supportTicketController.getTicketById);
router.put('/:id', supportTicketController.updateTicket);
router.delete('/:id', supportTicketController.deleteTicket);

module.exports = router;
