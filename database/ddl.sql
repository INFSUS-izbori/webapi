DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;

CREATE TABLE parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    dateOfEstablishment TEXT NOT NULL,
    logo TEXT NOT NULL,
    createdDate TEXT NOT NULL,
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

INSERT INTO parties (id, name, description, dateOfEstablishment, logo, createdDate) VALUES
('party1', 'Party A', 'Description A', '2023-01-01', 'logo_a.png', '2024-01-01T00:00:00.000Z'),
('party2', 'Party B', 'Description B', '2023-02-01', 'logo_b.png', '2024-01-02T00:00:00.000Z');

INSERT INTO candidates (id, oib, name, image, description, partyId, createdDate) VALUES
('candidate1', '12345678901', 'Candidate 1', 'image1.png', 'Description 1', 'party1', '2024-01-03T00:00:00.000Z'),
('candidate2', '98765432109', 'Candidate 2', 'image2.png', 'Description 2', 'party2', '2024-01-04T00:00:00.000Z');
