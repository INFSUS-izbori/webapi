const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const originalSqlite3 = jest.requireActual("sqlite3")

const ddlPath = path.resolve(__dirname, "../database/ddl.sql")
const ddlScript = fs.readFileSync(ddlPath, "utf8")

let sharedInMemoryDbInstance

function getSharedInMemoryDbInstance() {
    if (!sharedInMemoryDbInstance) {
        const sqlite3Verbose = originalSqlite3.verbose()
        sharedInMemoryDbInstance = new sqlite3Verbose.Database(":memory:", (err) => {
            if (err) {
                console.error("Failed to create in-memory database:", err)
                throw err
            }
            sharedInMemoryDbInstance.exec(ddlScript, (execErr) => {
                if (execErr) {
                    console.error("Failed to execute DDL script for in-memory database:", execErr)
                    throw execErr
                }
            })
        })
    }
    return sharedInMemoryDbInstance
}

const db = getSharedInMemoryDbInstance()

const globalPartyData = {
    name: "Global Test Party",
    description: "A party created for all tests",
    dateOfEstablishment: "2023-01-01",
    logo: "global_party_logo.png",
}
let createdDateForGlobalParty

beforeAll(async () => {
    global.testPartyId = uuidv4()
    createdDateForGlobalParty = new Date().toISOString()
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
    if (db) {
        db.close((err) => {
            if (err) {
                console.error("Failed to close in-memory database:", err)
            }
            done()
        })
    } else {
        done()
    }
})

module.exports = { db }
