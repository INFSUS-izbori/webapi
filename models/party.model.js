class Party {
    constructor(id, name, description, dateOfEstablishment, logo, createdDate) {
        if (!id) {
            throw new Error("ID is required")
        }
        if (!name) {
            throw new Error("Name is required")
        }
        const trimmedName = name.trim()
        if (trimmedName.length === 0) {
            throw new Error("Name cannot be empty or just whitespace")
        }
        if (trimmedName.length > 255) {
            throw new Error("Name must be less than 256 characters")
        }
        if (!description) {
            throw new Error("Description is required")
        }
        const trimmedDescription = description.trim()
        if (trimmedDescription.length === 0) {
            throw new Error("Description cannot be empty or just whitespace")
        }
        if (!dateOfEstablishment) {
            throw new Error("Date of Establishment is required")
        }
        if (!logo) {
            throw new Error("Logo is required")
        }
        if (!createdDate) {
            throw new Error("CreatedDate is required")
        }
        this.id = id
        this.name = trimmedName
        this.description = trimmedDescription
        this.dateOfEstablishment = dateOfEstablishment
        this.logo = logo
        this.createdDate = createdDate
    }
}

module.exports = Party
