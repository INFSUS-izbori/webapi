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
app.use(bodyParser.json())

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.error(err.message)
        process.exit(1)
    }
    console.log("Connected to the database.")

    fs.readFile("./database/ddl.sql", "utf8", (err, data) => {
        if (err) {
            console.error("Failed to read ddl.sql:", err)
            return
        }

        db.exec(data, (err) => {
            if (err) {
                console.error("Failed to execute ddl.sql:", err)
            } else {
                console.log("Database schema and mock data initialized.")
            }
            app.use("/api", partyRoutesFn(db))
            app.use("/api", candidateRoutesFn(db))
        })
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
