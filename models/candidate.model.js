class Candidate {
    constructor(id, oib, name, image, description, partyId, createdDate) {
         if (!id) {
            throw new Error('ID is required');
        }
        if (!oib) {
            throw new Error('OIB is required');
        }

        try {
            this.validateOIB(oib);
        } catch (error) {
            throw new Error(error.message);
        }

        if (!name) {
            throw new Error('Name is required');
        }
        if (!description) {
            throw new Error('Description is required');
        }
        if (!createdDate) {
            throw new Error('CreatedDate is required');
        }
        this.id = id;
        this.oib = oib;
        this.name = name;
        this.image = image;
        this.description = description;
        this.partyId = partyId;
        this.createdDate = createdDate;
    }

    // Validate OIB source: https://damjantomsic.from.hr/croatian-oib-personal-identification-number-generator/
    validateOIB(oib) {
        if (oib.length !== 11) {
            throw new Error('OIB must be 11 digits long.');
        }

        if (!/^\d+$/.test(oib)) {
            throw new Error('OIB must contain only digits.');
        }

        let oibArray = oib.split('').map(Number);
        let controlSum = 10;

        for (let i = 0; i < 10; i++) {
            controlSum = controlSum + oibArray[i];
            controlSum = controlSum % 10;
            if (controlSum === 0) {
                controlSum = 10;
            }
            controlSum *= 2;
            controlSum = controlSum % 11;
        }

        let controlNumber = 11 - controlSum;
        if (controlNumber === 10) {
            controlNumber = 0;
        }

        if (controlNumber !== oibArray[10]) {
            throw new Error('OIB is not valid.');
        }
    }
}

module.exports = Candidate;
