const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');
const { v4: uuidv4 } = require('uuid');
const Party = require('../models/party.model');

// Create a new party
exports.create = (req, res) => {
    const { name, description, dateOfEstablishment, logo } = req.body;
    const id = uuidv4();
    const createdDate = new Date().toISOString();

    try {
        new Party(id, name, description, dateOfEstablishment, logo, createdDate); // Validate the data
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

    db.run('INSERT INTO parties (id, name, description, dateOfEstablishment, logo, createdDate) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, description, dateOfEstablishment, logo, createdDate], function (err) {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            db.get('SELECT * FROM parties WHERE id = ?', id, (err, row) => {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                res.status(201).send(row);
            });
        });
};

// Get all parties
exports.findAll = (req, res) => {
    db.all('SELECT * FROM parties', (err, rows) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.status(200).send(rows);
    });
};

// Get a single party by id
exports.findOne = (req, res) => {
    db.get('SELECT * FROM parties WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!row) {
            return res.status(404).send({ message: 'Party not found' });
        }
        res.status(200).send(row);
    });
};

// Update a party by id
exports.update = (req, res) => {
    const { name, description, dateOfEstablishment, logo } = req.body;
    const id = req.params.id;

    try {
        new Party(id, name, description, dateOfEstablishment, logo, new Date().toISOString()); // Validate the data
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

    db.run('UPDATE parties SET name = ?, description = ?, dateOfEstablishment = ?, logo = ? WHERE id = ?',
        [name, description, dateOfEstablishment, logo, req.params.id], function (err) {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            db.get('SELECT * FROM parties WHERE id = ?', req.params.id, (err, row) => {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                if (!row) {
                    return res.status(404).send({ message: 'Party not found' });
                }
                res.status(200).send(row);
            });
        });
};

// Delete a party by id
exports.delete = (req, res) => {
    db.run('DELETE FROM parties WHERE id = ?', req.params.id, function (err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: 'Party deleted' });
    });
};
