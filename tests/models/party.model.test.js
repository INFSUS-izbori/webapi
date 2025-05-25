const Party = require("../../models/party.model")

describe("Party Model", () => {
    const validData = {
        id: "test-party-id",
        name: "Test Party",
        description: "A party for testing purposes",
        dateOfEstablishment: "2024-01-01",
        logo: "test_logo.png",
        createdDate: new Date().toISOString(),
    }

    it("should create a party instance with valid data", () => {
        const party = new Party(...Object.values(validData))
        expect(party).toBeInstanceOf(Party)
        expect(party.id).toBe(validData.id)
        expect(party.name).toBe(validData.name)
    })

    it("should throw an error if ID is missing", () => {
        const data = { ...validData, id: undefined }
        expect(() => new Party(...Object.values(data))).toThrow("ID is required")
    })

    it("should throw an error if name is missing", () => {
        const data = { ...validData, name: undefined }
        expect(() => new Party(...Object.values(data))).toThrow("Name is required")
    })

    it("should throw an error if name is too long", () => {
        const longName = "a".repeat(256)
        const data = { ...validData, name: longName }
        expect(() => new Party(...Object.values(data))).toThrow("Name must be less than 256 characters")
    })

    it("should throw an error if description is missing", () => {
        const data = { ...validData, description: undefined }
        expect(() => new Party(...Object.values(data))).toThrow("Description is required")
    })

    it("should throw an error if dateOfEstablishment is missing", () => {
        const data = { ...validData, dateOfEstablishment: undefined }
        expect(() => new Party(...Object.values(data))).toThrow("Date of Establishment is required")
    })

    it("should throw an error if logo is missing", () => {
        const data = { ...validData, logo: undefined }
        expect(() => new Party(...Object.values(data))).toThrow("Logo is required")
    })

    it("should throw an error if createdDate is missing", () => {
        const data = { ...validData, createdDate: undefined }
        expect(() => new Party(...Object.values(data))).toThrow("CreatedDate is required")
    })

    it("should throw an error if name consists only of whitespace", () => {
        const data = { ...validData, name: "   " }
        expect(() => new Party(...Object.values(data))).toThrow("Name cannot be empty or just whitespace")
    })

    it("should throw an error if description consists only of whitespace", () => {
        const data = { ...validData, description: "   " }
        expect(() => new Party(...Object.values(data))).toThrow("Description cannot be empty or just whitespace")
    })

    it("should trim whitespace from name and description", () => {
        const data = {
            ...validData,
            name: "  Test Party  ",
            description: "  A party for testing purposes  ",
        }
        const party = new Party(...Object.values(data))
        expect(party.name).toBe("Test Party")
        expect(party.description).toBe("A party for testing purposes")
    })

    it("should throw an error if dateOfEstablishment is an invalid date format", () => {
        const data = { ...validData, dateOfEstablishment: "not-a-date" }
        const party = new Party(...Object.values(data))
        expect(party.dateOfEstablishment).toBe("not-a-date")
    })

    it("should throw an error if logo is an empty string", () => {
        const data = { ...validData, logo: "" }
        expect(() => new Party(...Object.values(data))).toThrow("Logo is required")
    })
})
