const { v4: uuidv4 } = require("uuid")
const Party = require("../models/party.model")

exports.create = (req, res, db) => {
    const { name, description, dateOfEstablishment, logo } = req.body
    const id = uuidv4()
    const createdDate = new Date().toISOString()

    try {
        new Party(id, name, description, dateOfEstablishment, logo, createdDate)
    } catch (error) {
        return res.status(400).send({ message: error.message })
    }

    db.run(
        "INSERT INTO parties (id, name, description, dateOfEstablishment, logo, createdDate) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, description, dateOfEstablishment, logo, createdDate],
        function (err) {
            if (err) {
                return res.status(500).send({ message: err.message })
            }
            db.get("SELECT * FROM parties WHERE id = ?", id, (err, row) => {
                if (err) {
                    return res.status(500).send({ message: err.message })
                }
                res.status(201).send(row)
            })
        }
    )
}

exports.findAll = (req, res, db) => {
    db.all("SELECT * FROM parties", (err, rows) => {
        if (err) {
            return res.status(500).send({ message: err.message })
        }
        res.status(200).send(rows)
    })
}

exports.findOne = (req, res, db) => {
    db.get("SELECT * FROM parties WHERE id = ?", req.params.id, (err, row) => {
        if (err) {
            return res.status(500).send({ message: err.message })
        }
        if (!row) {
            return res.status(404).send({ message: "Party not found" })
        }
        res.status(200).send(row)
    })
}

exports.update = (req, res, db) => {
    const { name, description, dateOfEstablishment, logo } = req.body
    const id = req.params.id

    try {
        new Party(id, name, description, dateOfEstablishment, logo, new Date().toISOString())
    } catch (error) {
        return res.status(400).send({ message: error.message })
    }

    db.run(
        "UPDATE parties SET name = ?, description = ?, dateOfEstablishment = ?, logo = ? WHERE id = ?",
        [name, description, dateOfEstablishment, logo, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).send({ message: err.message })
            }
            db.get("SELECT * FROM parties WHERE id = ?", req.params.id, (err, row) => {
                if (err) {
                    return res.status(500).send({ message: err.message })
                }
                if (!row) {
                    return res.status(404).send({ message: "Party not found" })
                }
                res.status(200).send(row)
            })
        }
    )
}

exports.delete = (req, res, db) => {
    const partyId = req.params.id

    db.run("UPDATE candidates SET partyId = null WHERE partyId = ?", partyId, function (err) {
        if (err) {
            return res.status(500).send({ message: err.message })
        }

        db.run("DELETE FROM parties WHERE id = ?", partyId, function (err) {
            if (err) {
                return res.status(500).send({ message: err.message })
            }
            res.status(200).send({ message: "Party deleted and associated candidates updated." })
        })
    })
}
