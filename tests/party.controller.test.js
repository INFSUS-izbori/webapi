const request = require("supertest")
const express = require("express")
const bodyParser = require("body-parser")
const partyRoutes = require("../routes/party.routes")
const candidateRoutes = require("../routes/candidate.routes")
const { db: testDb } = require("./setupTests")

const app = express()
app.use(bodyParser.json())
app.use("/api", partyRoutes(testDb))
app.use("/api", candidateRoutes(testDb))

describe("Party API", () => {
    const newParty = {
        name: "Test Party Alpha",
        description: "A party for intensive testing",
        dateOfEstablishment: "2023-01-01",
        logo: "logo_alpha.png",
    }
    let createdPartyId

    it("should create a new party and then fetch it", async () => {
        const res = await request(app).post("/api/parties").send(newParty)
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty("id")
        createdPartyId = res.body.id

        const fetchRes = await request(app).get(`/api/parties/${createdPartyId}`)
        expect(fetchRes.statusCode).toEqual(200)
        expect(fetchRes.body.name).toBe(newParty.name)
    })

    it("should get all parties, ensuring global party and newly created party exist", async () => {
        const anotherParty = { ...newParty, name: "Test Party Beta", logo: "logo_beta.png" }
        const createRes = await request(app).post("/api/parties").send(anotherParty)
        expect(createRes.statusCode).toEqual(201)
        const anotherPartyId = createRes.body.id

        const res = await request(app).get("/api/parties")
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThanOrEqual(2)
        const globalPartyExists = res.body.some((party) => party.id === global.testPartyId)
        expect(globalPartyExists).toBe(true)
        const anotherPartyExists = res.body.some((party) => party.id === anotherPartyId)
        expect(anotherPartyExists).toBe(true)
    })

    it("should get a single party by id (using global party id)", async () => {
        const res = await request(app).get(`/api/parties/${global.testPartyId}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("id", global.testPartyId)
    })

    it("should update an existing party and verify update", async () => {
        const partyToUpdate = { ...newParty, name: "Initial Party Name for Update" }
        const createRes = await request(app).post("/api/parties").send(partyToUpdate)
        expect(createRes.statusCode).toEqual(201)
        const partyId = createRes.body.id

        const updatedData = {
            name: "Updated Party Name",
            description: "Updated description for intensive testing",
            dateOfEstablishment: "2023-02-02",
            logo: "updated_logo_alpha.png",
        }
        const updateRes = await request(app).put(`/api/parties/${partyId}`).send(updatedData)
        expect(updateRes.statusCode).toEqual(200)
        expect(updateRes.body.name).toBe(updatedData.name)
        expect(updateRes.body.description).toBe(updatedData.description)

        const fetchRes = await request(app).get(`/api/parties/${partyId}`)
        expect(fetchRes.statusCode).toEqual(200)
        expect(fetchRes.body.name).toBe(updatedData.name)
    })

    it("should delete a party and ensure it's no longer fetchable", async () => {
        const partyToDelete = { ...newParty, name: "Party for Deletion" }
        const createRes = await request(app).post("/api/parties").send(partyToDelete)
        expect(createRes.statusCode).toEqual(201)
        const partyId = createRes.body.id

        const deleteRes = await request(app).delete(`/api/parties/${partyId}`)
        expect(deleteRes.statusCode).toEqual(200)
        expect(deleteRes.body.message).toBe("Party deleted and associated candidates updated.")

        const fetchRes = await request(app).get(`/api/parties/${partyId}`)
        expect(fetchRes.statusCode).toEqual(404)
    })

    it("should delete a party and ensure associated candidates have their partyId nulled", async () => {
        const customParty = { ...newParty, name: "Party With Candidates" }
        const partyRes = await request(app).post("/api/parties").send(customParty)
        expect(partyRes.statusCode).toEqual(201)
        const customPartyId = partyRes.body.id

        const candidateData = {
            name: "Test Candidate Gamma",
            oib: generateValidOIB(),
            image: "candidate_gamma.jpg",
            description: "A candidate for the custom party",
            partyId: customPartyId,
        }
        const candidateRes = await request(app).post("/api/candidates").send(candidateData)
        expect(candidateRes.statusCode).toEqual(201)
        const candidateId = candidateRes.body.id

        const deletePartyRes = await request(app).delete(`/api/parties/${customPartyId}`)
        expect(deletePartyRes.statusCode).toEqual(200)

        const fetchCandidateRes = await request(app).get(`/api/candidates/${candidateId}`)
        expect(fetchCandidateRes.statusCode).toEqual(200)
        expect(fetchCandidateRes.body.partyId).toBeNull()
    })

    it("should fail to create a party with missing name", async () => {
        const { name, ...partyDataWithoutName } = newParty
        const res = await request(app).post("/api/parties").send(partyDataWithoutName)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toBe("Name is required")
    })

    it("should fail to create a party with name as only whitespace", async () => {
        const partyDataWithWhitespaceName = { ...newParty, name: "   " }
        const res = await request(app).post("/api/parties").send(partyDataWithWhitespaceName)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toBe("Name cannot be empty or just whitespace")
    })

    it("should fail to update a non-existent party", async () => {
        const nonExistentPartyId = "uuid-that-does-not-exist"
        const updatedData = { ...newParty, name: "Updated Non Existent Party" }
        const res = await request(app).put(`/api/parties/${nonExistentPartyId}`).send(updatedData)
        expect(res.statusCode).toEqual(404)
    })

    it("should fail to delete a non-existent party", async () => {
        const nonExistentPartyId = "uuid-that-does-not-exist"
        const res = await request(app).delete(`/api/parties/${nonExistentPartyId}`)
        expect(res.statusCode).toEqual(404)
    })

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
})
