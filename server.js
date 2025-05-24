const express = require("express")
const bodyParser = require("body-parser")
const partyRoutesFn = require("./routes/party.routes")
const candidateRoutesFn = require("./routes/candidate.routes")
const sqlite3 = require("sqlite3").verbose()
const fs = require("fs")
const cors = require("cors") // Import cors

const app = express()
const port = 3000

app.use(cors()) // Enable CORS for all routes
app.use(
    bodyParser.json({
        limit: "50mb", // Increase the limit for larger payloads
    })
)

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.error(err.message)
        process.exit(1)
    }
    console.log("Connected to the database.")

    // Check if the database is already initialized
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='parties'", (err, table) => {
        if (err) {
            console.error("Failed to check for existing tables:", err)
            // Exit if we can't check the database
            process.exit(1)
        }

        if (!table) {
            // Tables do not exist, so run the DDL script
            fs.readFile("./database/ddl.sql", "utf8", (err, data) => {
                if (err) {
                    console.error("Failed to read ddl.sql:", err)
                    // Exit if we can't read the DDL script
                    process.exit(1)
                }

                db.exec(data, (err) => {
                    if (err) {
                        console.error("Failed to execute ddl.sql:", err)
                        // Exit if we can't execute the DDL script
                        process.exit(1)
                    } else {
                        console.log("Database schema initialized from ddl.sql.")
                    }
                    // Setup routes after DDL execution (or failure)
                    app.use("/api", partyRoutesFn(db))
                    app.use("/api", candidateRoutesFn(db))
                })
            })
        } else {
            // Tables exist, DDL script not executed
            console.log("Database already initialized. Skipping DDL script.")
            // Setup routes
            app.use("/api", partyRoutesFn(db))
            app.use("/api", candidateRoutesFn(db))
        }
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
