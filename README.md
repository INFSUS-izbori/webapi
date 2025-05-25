# WebAPI - Political Parties and Candidates Management

This project is a Web API for managing political parties and their candidates. It allows for CRUD (Create, Read, Update, Delete) operations on both parties and candidates.

## Features

-   Manage political parties (create, list, view, update, delete).
-   Manage candidates (create, list, view, update, delete).
-   Associate candidates with political parties.
-   Validation for data models (e.g., OIB for candidates, required fields).
-   SQLite database for data persistence.
-   In-memory database for isolated testing.
-   CORS enabled for all routes.

## Prerequisites

-   [Node.js](https://nodejs.org/) (which includes npm)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/INFSUS-izbori/webapi.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd webapi
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The API will be running on `http://localhost:3000`.

## Running Tests

To run the automated tests:

```bash
npm test
```

Tests are run using Jest and Supertest, utilizing an in-memory SQLite database for isolation.

## Database

The application uses SQLite for its database.

-   **Database File**: `database/database.db` (created automatically if it doesn't exist)
-   **Schema Initialization**: The database schema is defined in `database/ddl.sql`. When the server starts, it checks if the `parties` table exists. If not, it executes `ddl.sql` to create the necessary tables and insert initial data.

### Database Schema

**Table: `parties`**

| Column                | Type   | Constraints          | Description                               |
| --------------------- | ------ | -------------------- | ----------------------------------------- |
| `id`                  | `TEXT` | `PRIMARY KEY`        | Unique identifier for the party (UUID)    |
| `name`                | `TEXT` | `NOT NULL`, `UNIQUE` | Name of the party                         |
| `description`         | `TEXT` | `NOT NULL`           | Description of the party                  |
| `dateOfEstablishment` | `TEXT` | `NOT NULL`           | Date when the party was established (ISO) |
| `logo`                | `TEXT` | `NOT NULL`           | Base64 encoded string                     |
| `createdDate`         | `TEXT` | `NOT NULL`           | Date when the record was created (ISO)    |

**Table: `candidates`**

| Column        | Type   | Constraints                                    | Description                                         |
| ------------- | ------ | ---------------------------------------------- | --------------------------------------------------- |
| `id`          | `TEXT` | `PRIMARY KEY`                                  | Unique identifier for the candidate (UUID)          |
| `oib`         | `TEXT` | `NOT NULL`, `UNIQUE`                           | Croatian Personal Identification Number (OIB)       |
| `name`        | `TEXT` | `NOT NULL`                                     | Name of the candidate                               |
| `image`       | `TEXT` |                                                | Base64 encoded string                               |
| `description` | `TEXT` | `NOT NULL`                                     | Description of the candidate                        |
| `partyId`     | `TEXT` | `FOREIGN KEY (partyId) REFERENCES parties(id)` | ID of the party the candidate belongs to (nullable) |
| `createdDate` | `TEXT` | `NOT NULL`                                     | Date when the record was created (ISO)              |

_(Note: The `ddl.sql` file provided in the attachments has a simplified schema in its first 22 lines. The table definitions above are based on the model and controller logic.)_

## API Endpoints

All endpoints are prefixed with `/api`.

### Party Endpoints

Base path: `/api/parties`

-   **`POST /parties`**

    -   Description: Creates a new political party.
    -   Request Body:
        ```json
        {
            "name": "string (required, unique)",
            "description": "string (required)",
            "dateOfEstablishment": "string (ISO date, required)",
            "logo": "string (base64, required)"
        }
        ```
    -   Success Response (201):
        ```json
        {
            "id": "uuid",
            "name": "string",
            "description": "string",
            "dateOfEstablishment": "string",
            "logo": "string",
            "createdDate": "string"
        }
        ```
    -   Error Response (400): If validation fails (e.g., missing fields, name not unique).
        ```json
        { "message": "Error message" }
        ```
    -   Error Response (500): If a server error occurs.

-   **`GET /parties`**

    -   Description: Retrieves a list of all political parties.
    -   Success Response (200):
        ```json
        [
            {
                "id": "uuid",
                "name": "string",
                "description": "string"
                // ... other party fields
            }
        ]
        ```

-   **`GET /parties/:id`**

    -   Description: Retrieves a specific political party by its ID.
    -   Success Response (200): Party object (as above).
    -   Error Response (404): If party not found.
        ```json
        { "message": "Party not found" }
        ```

-   **`PUT /parties/:id`**

    -   Description: Updates an existing political party.
    -   Request Body: Same as POST.
    -   Success Response (200): Updated party object.
    -   Error Response (400): If validation fails.
    -   Error Response (404): If party not found.

-   **`DELETE /parties/:id`**
    -   Description: Deletes a political party. Associated candidates will have their `partyId` set to `null`.
    -   Success Response (200):
        ```json
        { "message": "Party deleted and associated candidates updated." }
        ```
    -   Error Response (404): If party not found.

### Candidate Endpoints

Base path: `/api/candidates`

-   **`POST /candidates`**

    -   Description: Creates a new candidate.
    -   Request Body:
        ```json
        {
            "oib": "string (required, unique, 11 digits, valid OIB)",
            "name": "string (required)",
            "image": "string (optional, base64)",
            "description": "string (required)",
            "partyId": "uuid (optional, references party ID)"
        }
        ```
    -   Success Response (201):
        ```json
        {
            "id": "uuid",
            "oib": "string",
            "name": "string",
            "image": "string",
            "description": "string",
            "partyId": "uuid",
            "createdDate": "string"
        }
        ```
    -   Error Response (400): If validation fails (e.g., invalid OIB, missing fields).
    -   Error Response (500): If OIB is not unique or other server error.

-   **`GET /candidates`**

    -   Description: Retrieves a list of all candidates.
    -   Success Response (200): Array of candidate objects.

-   **`GET /candidates/:id`**

    -   Description: Retrieves a specific candidate by ID.
    -   Success Response (200): Candidate object.
    -   Error Response (404): If candidate not found.

-   **`PUT /candidates/:id`**

    -   Description: Updates an existing candidate.
    -   Request Body: Same as POST.
    -   Success Response (200): Updated candidate object.
    -   Error Response (400): If validation fails.
    -   Error Response (404): If candidate not found.

-   **`DELETE /candidates/:id`**
    -   Description: Deletes a candidate.
    -   Success Response (200):
        ```json
        { "message": "Candidate deleted" }
        ```

## Data Models

### Party Model (`models/party.model.js`)

-   **Fields**:
    -   `id`: UUID (string)
    -   `name`: string (trimmed, required, max 255 chars)
    -   `description`: string (trimmed, required)
    -   `dateOfEstablishment`: string (ISO date, required)
    -   `logo`: string (required)
    -   `createdDate`: string (ISO date, required)
-   **Validation**: Throws errors if required fields are missing or if `name` is empty/whitespace or too long.

### Candidate Model (`models/candidate.model.js`)

-   **Fields**:
    -   `id`: UUID (string)
    -   `oib`: string (trimmed, required, 11 digits, valid OIB format)
    -   `name`: string (trimmed, required)
    -   `image`: string (optional)
    -   `description`: string (trimmed, required)
    -   `partyId`: UUID (string, optional)
    -   `createdDate`: string (ISO date, required)
-   **Validation**:
    -   Throws errors for missing required fields.
    -   `oib`: Must be 11 digits, contain only digits, and pass a checksum validation.
    -   `name`, `description`: Cannot be empty or just whitespace.

## Project Structure

```
webapi/
├── controllers/        # Request handlers
│   ├── candidate.controller.js
│   └── party.controller.js
├── database/           # Database files
│   ├── database.db     # SQLite database file (created on run)
│   └── ddl.sql         # Database schema definition
├── models/             # Data models and validation
│   ├── candidate.model.js
│   └── party.model.js
├── node_modules/       # Project dependencies
├── routes/             # API route definitions
│   ├── candidate.routes.js
│   └── party.routes.js
├── tests/              # Automated tests
│   ├── candidate.controller.test.js
│   ├── models/
│   │   ├── candidate.model.test.js
│   │   └── party.model.test.js
│   ├── party.controller.test.js
│   └── setupTests.js   # Jest setup file for tests
├── .gitignore
├── jest.config.js      # Jest configuration
├── package-lock.json
├── package.json        # Project metadata and dependencies
├── README.md           # This file
└── server.js           # Main application entry point
```

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: SQLite3
-   **Testing**: Jest, Supertest
-   **Utilities**:
    -   `uuid` for generating unique IDs.
    -   `cors` for enabling Cross-Origin Resource Sharing.
    -   `body-parser` for parsing request bodies.
