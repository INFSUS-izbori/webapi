const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');
const { v4: uuidv4 } = require('uuid');
const Candidate = require('../models/candidate.model');

// Create a new candidate
exports.create = (req, res) => {
    const { oib, name, image, description, partyId } = req.body;
    const id = uuidv4();
    const createdDate = new Date().toISOString();

    try {
        new Candidate(id, oib, name, image, description, partyId, createdDate); // Validate the data
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

    db.run('INSERT INTO candidates (id, oib, name, image, description, partyId, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, oib, name, image, description, partyId, createdDate], function (err) {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
             db.get('SELECT * FROM candidates WHERE id = ?', id, (err, row) => {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                res.status(201).send(row);
            });
        });
};

// Get all candidates
exports.findAll = (req, res) => {
    db.all('SELECT * FROM candidates', (err, rows) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.status(200).send(rows);
    });
};

// Get a single candidate by id
exports.findOne = (req, res) => {
    db.get('SELECT * FROM candidates WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!row) {
            return res.status(404).send({ message: 'Candidate not found' });
        }
        res.status(200).send(row);
    });
};

// Update a candidate by id
exports.update = (req, res) => {
    const { oib, name, image, description, partyId } = req.body;
     const id = req.params.id;

    try {
        new Candidate(id, oib, name, image, description, partyId, new Date().toISOString()); // Validate the data
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
    db.run('UPDATE candidates SET oib = ?, name = ?, image = ?, description = ?, partyId = ? WHERE id = ?',
        [oib, name, image, description, partyId, req.params.id], function (err) {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            db.get('SELECT * FROM candidates WHERE id = ?', req.params.id, (err, row) => {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                if (!row) {
                    return res.status(404).send({ message: 'Candidate not found' });
                }
                res.status(200).send(row);
            });
        });
};

// Delete a candidate by id
exports.delete = (req, res) => {
    db.run('DELETE FROM candidates WHERE id = ?', req.params.id, function (err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: 'Candidate deleted' });
    });
};
