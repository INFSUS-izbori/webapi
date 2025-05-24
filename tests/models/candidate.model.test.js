const Candidate = require("../../models/candidate.model")

// Helper to generate a valid OIB for testing
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

describe("Candidate Model", () => {
    const validOIB = generateValidOIB()
    const validData = {
        id: "test-id",
        oib: validOIB,
        name: "Test Candidate",
        image: "test.jpg",
        description: "A test candidate",
        partyId: "party-id",
        createdDate: new Date().toISOString(),
    }

    it("should create a candidate instance with valid data", () => {
        const candidate = new Candidate(...Object.values(validData))
        expect(candidate).toBeInstanceOf(Candidate)
        expect(candidate.id).toBe(validData.id)
        expect(candidate.oib).toBe(validData.oib)
        expect(candidate.name).toBe(validData.name)
    })

    it("should throw an error if ID is missing", () => {
        const data = { ...validData, id: undefined }
        expect(() => new Candidate(...Object.values(data))).toThrow("ID is required")
    })

    it("should throw an error if OIB is missing", () => {
        const data = { ...validData, oib: undefined }
        expect(() => new Candidate(...Object.values(data))).toThrow("OIB is required")
    })

    it("should throw an error if name is missing", () => {
        const data = { ...validData, name: undefined }
        expect(() => new Candidate(...Object.values(data))).toThrow("Name is required")
    })

    it("should throw an error if description is missing", () => {
        const data = { ...validData, description: undefined }
        expect(() => new Candidate(...Object.values(data))).toThrow("Description is required")
    })

    it("should throw an error if createdDate is missing", () => {
        const data = { ...validData, createdDate: undefined }
        expect(() => new Candidate(...Object.values(data))).toThrow("CreatedDate is required")
    })

    // PartyId can be null/undefined if the candidate is independent
    it("should allow partyId to be null", () => {
        const data = { ...validData, partyId: null }
        const candidate = new Candidate(...Object.values(data))
        expect(candidate.partyId).toBeNull()
    })

    it("should allow partyId to be undefined", () => {
        const data = { ...validData, partyId: undefined }
        const candidate = new Candidate(...Object.values(data))
        expect(candidate.partyId).toBeUndefined()
    })

    describe("OIB Validation", () => {
        it("should throw an error for OIB with incorrect length", () => {
            expect(
                () =>
                    new Candidate(
                        validData.id,
                        "12345",
                        validData.name,
                        validData.image,
                        validData.description,
                        validData.partyId,
                        validData.createdDate
                    )
            ).toThrow("OIB must be 11 digits long.")
        })

        it("should throw an error for OIB with non-digit characters", () => {
            expect(
                () =>
                    new Candidate(
                        validData.id,
                        "1234567890a",
                        validData.name,
                        validData.image,
                        validData.description,
                        validData.partyId,
                        validData.createdDate
                    )
            ).toThrow("OIB must contain only digits.")
        })

        it("should throw an error for an invalid OIB control number", () => {
            // This OIB is 11 digits, all numbers, but the control digit is incorrect.
            expect(
                () =>
                    new Candidate(
                        validData.id,
                        "12345678901",
                        validData.name,
                        validData.image,
                        validData.description,
                        validData.partyId,
                        validData.createdDate
                    )
            ).toThrow("OIB is not valid.")
        })

        it("should not throw for a valid OIB", () => {
            expect(
                () =>
                    new Candidate(
                        validData.id,
                        validOIB,
                        validData.name,
                        validData.image,
                        validData.description,
                        validData.partyId,
                        validData.createdDate
                    )
            ).not.toThrow()
        })
    })
})
