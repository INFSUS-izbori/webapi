const express = require("express")
const bodyParser = require("body-parser")
const partyRoutesFn = require("./routes/party.routes")
const candidateRoutesFn = require("./routes/candidate.routes")
const sqlite3 = require("sqlite3").verbose()
const fs = require("fs")
const cors = require("cors")

const app = express()
const port = 3000

app.use(cors())
app.use(
    bodyParser.json({
        limit: "50mb",
    })
)

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.error(err.message)
        process.exit(1)
    }
    console.log("Connected to the database.")

    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='parties'", (err, table) => {
        if (err) {
            console.error("Failed to check for existing tables:", err)
            process.exit(1)
        }

        if (!table) {
            fs.readFile("./database/ddl.sql", "utf8", (err, data) => {
                if (err) {
                    console.error("Failed to read ddl.sql:", err)
                    process.exit(1)
                }

                db.exec(data, (err) => {
                    if (err) {
                        console.error("Failed to execute ddl.sql:", err)
                        process.exit(1)
                    } else {
                        console.log("Database schema initialized from ddl.sql.")
                    }
                    app.use("/api", partyRoutesFn(db))
                    app.use("/api", candidateRoutesFn(db))
                })
            })
        } else {
            console.log("Database already initialized. Skipping DDL script.")
            app.use("/api", partyRoutesFn(db))
            app.use("/api", candidateRoutesFn(db))
        }
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
