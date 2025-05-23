const express = require('express');
const bodyParser = require('body-parser');
const partyRoutes = require('./routes/party.routes');
const candidateRoutes = require('./routes/candidate.routes');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api', partyRoutes);
app.use('/api', candidateRoutes);

const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');

    fs.readFile('.database/ddl.sql', 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read ddl.sql:', err);
            return;
        }

        db.exec(data, (err) => {
            if (err) {
                console.error('Failed to execute ddl.sql:', err);
            } else {
                console.log('Database schema and mock data initialized.');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
