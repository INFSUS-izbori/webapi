const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');

router.post('/candidates', candidateController.create);

router.get('/candidates', candidateController.findAll);

router.get('/candidates/:id', candidateController.findOne);

router.put('/candidates/:id', candidateController.update);

router.delete('/candidates/:id', candidateController.delete);

module.exports = router;
