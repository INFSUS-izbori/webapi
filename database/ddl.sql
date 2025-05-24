DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;

CREATE TABLE parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    dateOfEstablishment TEXT NOT NULL,
    logo TEXT NOT NULL,
    createdDate TEXT NOT NULL
);

CREATE TABLE candidates (
    id TEXT PRIMARY KEY,
    oib TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image TEXT,
    description TEXT NOT NULL,
    partyId TEXT,
    createdDate TEXT NOT NULL,
    FOREIGN KEY (partyId) REFERENCES parties(id)
);