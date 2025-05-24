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

        it("should trim whitespace from OIB", () => {
            const oibWithSpace = `  ${validOIB}  `
            const candidate = new Candidate(
                validData.id,
                oibWithSpace,
                validData.name,
                validData.image,
                validData.description,
                validData.partyId,
                validData.createdDate
            )
            expect(candidate.oib).toBe(validOIB)
        })

        it("should throw an error if OIB is only whitespace", () => {
            const data = { ...validData, oib: "           " } // 11 spaces
            expect(() => new Candidate(...Object.values(data))).toThrow("OIB must be 11 digits long.") // Or "OIB must contain only digits." depending on trim order
        })
    })

    describe("Name Validation", () => {
        it("should trim whitespace from name", () => {
            const nameWithSpace = "  Test Candidate  "
            const candidate = new Candidate(
                validData.id,
                validData.oib,
                nameWithSpace,
                validData.image,
                validData.description,
                validData.partyId,
                validData.createdDate
            )
            expect(candidate.name).toBe("Test Candidate")
        })

        it("should throw an error if name is only whitespace", () => {
            const data = { ...validData, name: "   " }
            expect(() => new Candidate(...Object.values(data))).toThrow("Name cannot be empty or just whitespace")
        })
    })

    describe("Description Validation", () => {
        it("should trim whitespace from description", () => {
            const descriptionWithSpace = "  A test candidate  "
            const candidate = new Candidate(
                validData.id,
                validData.oib,
                validData.name,
                validData.image,
                descriptionWithSpace,
                validData.partyId,
                validData.createdDate
            )
            expect(candidate.description).toBe("A test candidate")
        })

        it("should throw an error if description is only whitespace", () => {
            const data = { ...validData, description: "   " }
            expect(() => new Candidate(...Object.values(data))).toThrow("Description cannot be empty or just whitespace")
        })
    })
})
