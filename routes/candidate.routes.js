const express = require("express")
const candidateController = require("../controllers/candidate.controller")

module.exports = (db) => {
    const router = express.Router()

    router.post("/candidates", (req, res) => candidateController.create(req, res, db))

    router.get("/candidates", (req, res) => candidateController.findAll(req, res, db))

    router.get("/candidates/:id", (req, res) => candidateController.findOne(req, res, db))

    router.put("/candidates/:id", (req, res) => candidateController.update(req, res, db))

    router.delete("/candidates/:id", (req, res) => candidateController.delete(req, res, db))

    return router
}
