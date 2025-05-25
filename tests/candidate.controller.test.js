const request = require("supertest")
const express = require("express")
const bodyParser = require("body-parser")
const candidateRoutesFn = require("../routes/candidate.routes")
const partyRoutesFn = require("../routes/party.routes")
const { db } = require("./setupTests")
const e = require("express")

const app = express()
app.use(bodyParser.json())
app.use("/api", candidateRoutesFn(db))
app.use("/api", partyRoutesFn(db))

const generateValidOIB = () => {
    let oib = ""
    for (let i = 0; i < 10; i++) {
        oib += Math.floor(Math.random() * 10)
    }
    let oibArray = oib.split("").map(Number)
    let controlSum = 10
    for (let i = 0; i < 10; i++) {
        controlSum = controlSum + oibArray[i]
        controlSum = controlSum % 10
        if (controlSum === 0) controlSum = 10
        controlSum *= 2
        controlSum = controlSum % 11
    }
    let controlNumber = 11 - controlSum
    if (controlNumber === 10) controlNumber = 0
    return oib + controlNumber
}

describe("Candidate API", () => {
    let createdCandidateId

    const newCandidate = {
        name: "Test Candidate Beta",
        image: "candidate_beta.jpg",
        description: "A candidate for rigorous testing",
    }

    beforeEach(async () => {
        const candidateOIB = generateValidOIB()
        const candidateData = { ...newCandidate, partyId: global.testPartyId, oib: candidateOIB }
        const res = await request(app).post("/api/candidates").send(candidateData)
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty("id")
        expect(res.body.name).toBe(candidateData.name)
        expect(res.body.oib).toBe(candidateData.oib)
        createdCandidateId = res.body.id
    })

    it("should create a new candidate", async () => {
        const candidateOIB = generateValidOIB()

        const candidateData = { ...newCandidate, partyId: global.testPartyId, oib: candidateOIB }
        const res = await request(app).post("/api/candidates").send(candidateData)
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty("id")
        expect(res.body.name).toBe(candidateData.name)
        expect(res.body.oib).toBe(candidateData.oib)

        const deleteRes = await request(app).delete(`/api/candidates/${res.body.id}`)
        expect(deleteRes.statusCode).toEqual(200)
    })

    it("should fail to create a candidate with an invalid OIB", async () => {
        const candidateData = { ...newCandidate, partyId: global.testPartyId, oib: "12345678900" }
        const res = await request(app).post("/api/candidates").send(candidateData)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toBe("OIB is not valid.")
    })

    it("should fail to create a candidate with a duplicate OIB", async () => {
        const candidateOIB = generateValidOIB()

        const candidateData = { ...newCandidate, name: "Duplicate OIB Candidate", partyId: global.testPartyId, oib: candidateOIB } // Use same OIB
        const res = await request(app).post("/api/candidates").send(candidateData)
        expect(res.statusCode).toEqual(201)

        const duplicateRes = await request(app)
            .post("/api/candidates")
            .send({ ...candidateData, name: "Another Candidate with Same OIB" })
        expect(duplicateRes.statusCode).toEqual(500)
        expect(duplicateRes.body.message).toBe("SQLITE_CONSTRAINT: UNIQUE constraint failed: candidates.oib")

        const deleteRes = await request(app).delete(`/api/candidates/${res.body.id}`)
        expect(deleteRes.statusCode).toEqual(200)
    })

    it("should get all candidates", async () => {
        const res = await request(app).get("/api/candidates")
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
        const candidateExists = res.body.some((c) => c.id === createdCandidateId)
        expect(candidateExists).toBe(true)
    })

    it("should get a single candidate by id", async () => {
        expect(createdCandidateId).toBeDefined()
        const res = await request(app).get(`/api/candidates/${createdCandidateId}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("id", createdCandidateId)
    })

    it("should return 404 for a non-existent candidate", async () => {
        const nonExistentId = "uuid-that-does-not-exist"
        const res = await request(app).get(`/api/candidates/${nonExistentId}`)
        expect(res.statusCode).toEqual(404)
    })

    it("should update an existing candidate", async () => {
        expect(createdCandidateId).toBeDefined()
        const updatedData = {
            oib: generateValidOIB(),
            name: "Updated Test Candidate Beta",
            image: "updated_candidate_beta.jpg",
            description: "Updated description for Beta",
            partyId: global.testPartyId,
        }
        const res = await request(app).put(`/api/candidates/${createdCandidateId}`).send(updatedData)
        expect(res.statusCode).toEqual(200)
        expect(res.body.name).toBe(updatedData.name)
        expect(res.body.oib).toBe(updatedData.oib)
    })

    it("should delete a candidate", async () => {
        expect(createdCandidateId).toBeDefined()
        const res = await request(app).delete(`/api/candidates/${createdCandidateId}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toBe("Candidate deleted")

        const getRes = await request(app).get(`/api/candidates/${createdCandidateId}`)
        expect(getRes.statusCode).toEqual(404)
    })
})
