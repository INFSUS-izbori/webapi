const express = require('express');
const router = express.Router();
const partyController = require('../controllers/party.controller');

router.post('/parties', partyController.create);

router.get('/parties', partyController.findAll);

router.get('/parties/:id', partyController.findOne);

router.put('/parties/:id', partyController.update);

router.delete('/parties/:id', partyController.delete);

module.exports = router;
