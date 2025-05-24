const express = require("express")
const partyController = require("../controllers/party.controller")

module.exports = (db) => {
    const router = express.Router()

    router.post("/parties", (req, res) => partyController.create(req, res, db))

    router.get("/parties", (req, res) => partyController.findAll(req, res, db))

    router.get("/parties/:id", (req, res) => partyController.findOne(req, res, db))

    router.put("/parties/:id", (req, res) => partyController.update(req, res, db))

    router.delete("/parties/:id", (req, res) => partyController.delete(req, res, db))

    return router
}
