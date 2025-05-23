const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');

// Create a new candidate
router.post('/candidates', candidateController.create);

// Get all candidates
router.get('/candidates', candidateController.findAll);

// Get a single candidate by id
router.get('/candidates/:id', candidateController.findOne);

// Update a candidate by id
router.put('/candidates/:id', candidateController.update);

// Delete a candidate by id
router.delete('/candidates/:id', candidateController.delete);

module.exports = router;
