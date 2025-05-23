class Party {
    constructor(id, name, description, dateOfEstablishment, logo, createdDate) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!name) {
            throw new Error('Name is required');
        }
        if (name.length > 255) {
            throw new Error('Name must be less than 256 characters');
        }
        if (!description) {
            throw new Error('Description is required');
        }
        if (!dateOfEstablishment) {
            throw new Error('Date of Establishment is required');
        }
        if (!logo) {
             throw new Error('Logo is required');
        }
        if (!createdDate) {
            throw new Error('CreatedDate is required');
        }
        this.id = id;
        this.name = name;
        this.description = description;
        this.dateOfEstablishment = dateOfEstablishment;
        this.logo = logo;
        this.createdDate = createdDate;
    }
}

module.exports = Party;
