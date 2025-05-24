const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid") // Added for generating party ID
// Use jest.requireActual to get the original sqlite3 for creating our test DB
const originalSqlite3 = jest.requireActual("sqlite3")

// Path to the DDL script
const ddlPath = path.resolve(__dirname, "../database/ddl.sql")
const ddlScript = fs.readFileSync(ddlPath, "utf8")

let sharedInMemoryDbInstance

// Function to create/get the singleton in-memory DB instance
// This function is hoisted and can be safely called by jest.mock
function getSharedInMemoryDbInstance() {
    if (!sharedInMemoryDbInstance) {
        const sqlite3Verbose = originalSqlite3.verbose()
        sharedInMemoryDbInstance = new sqlite3Verbose.Database(":memory:", (err) => {
            if (err) {
                console.error("Failed to create in-memory database:", err)
                throw err // Throw error for clearer test failures
            }
            sharedInMemoryDbInstance.exec(ddlScript, (execErr) => {
                if (execErr) {
                    console.error("Failed to execute DDL script for in-memory database:", execErr)
                    throw execErr // Throw error
                }
                // console.log("In-memory test DB initialized with DDL."); // Optional: for debugging
            })
        })
    }
    return sharedInMemoryDbInstance
}

// Get the DB instance for hooks and export
const db = getSharedInMemoryDbInstance()

const globalPartyData = {
    name: "Global Test Party",
    description: "A party created for all tests",
    dateOfEstablishment: "2023-01-01",
    logo: "global_party_logo.png",
}
let createdDateForGlobalParty

beforeAll(async () => {
    // Create a global party for tests that need a partyId
    global.testPartyId = uuidv4()
    createdDateForGlobalParty = new Date().toISOString()
    // The party will be inserted in beforeEach after tables are cleared
})

beforeEach(async () => {
    const tables = ["candidates", "parties"]
    for (const table of tables) {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table}`, (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
    }
    // Re-insert the global party after clearing tables
    await new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO parties (id, name, description, dateOfEstablishment, logo, createdDate) VALUES (?, ?, ?, ?, ?, ?)",
            [
                global.testPartyId,
                globalPartyData.name,
                globalPartyData.description,
                globalPartyData.dateOfEstablishment,
                globalPartyData.logo,
                createdDateForGlobalParty,
            ],
            function (err) {
                if (err) {
                    console.error("Failed to re-create global test party in beforeEach:", err)
                    return reject(err)
                }
                resolve()
            }
        )
    })
})

afterAll((done) => {
    // Ensure db instance exists before trying to close
    if (db) {
        db.close((err) => {
            if (err) {
                console.error("Failed to close in-memory database:", err)
            }
            done()
        })
    } else {
        done() // If db was never initialized, just call done
    }
})

module.exports = { db } // Export the in-memory db instance
