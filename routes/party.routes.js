const express = require('express');
const router = express.Router();
const partyController = require('../controllers/party.controller');

// Create a new party
router.post('/parties', partyController.create);

// Get all parties
router.get('/parties', partyController.findAll);

// Get a single party by id
router.get('/parties/:id', partyController.findOne);

// Update a party by id
router.put('/parties/:id', partyController.update);

// Delete a party by id
router.delete('/parties/:id', partyController.delete);

module.exports = router;
