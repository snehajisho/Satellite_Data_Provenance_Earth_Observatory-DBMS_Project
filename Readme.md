# Satellite Data Provenance & Earth Observation Repository

## Team Information

| Name | SRN |
|---|---|
| Sneha Angelin Jisho | PES2UG24CS507 |
| Sowmya Ramesh | PES2UG24CS512 |

**Course:** DBMS Project — Semester 5

## Overview

A web application for managing satellite missions, sensors, ground stations, Earth observation records, data products, metadata, and processing provenance.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Relational Database:** MySQL
- **Metadata and Image References:** MongoDB
- **Authentication:** JWT and bcrypt

## Project Structure

```text
Satellite_Data_Provenance_Earth_Observatory-DBMS_Project/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── authMiddleware.js
│   │   ├── metadata.js
│   │   ├── observations.js
│   │   ├── provenance.js
│   │   └── satellites.js
│   ├── db.js
│   ├── index.js
│   ├── mongo.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── 01_create_tables.sql
│   ├── 02_insert_sample_data.sql
│   ├── 03_queries.sql
│   ├── 04_views.sql
│   ├── 05_indexes.sql
│   ├── 06_transactions.sql
│   ├── 07_procedures_functions.sql
│   ├── 08_triggers.sql
│   └── mongodb/
│       ├── data.js
│       ├── queries.js
│       └── images/
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── .env.example
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/snehajisho/Satellite_Data_Provenance_Earth_Observatory-DBMS_Project.git
cd Satellite_Data_Provenance_Earth_Observatory-DBMS_Project
```

### 2. Set Up MySQL

Start MySQL and open **MySQL Workbench**.

Execute the SQL files in this order:

1. `database/01_create_tables.sql` — creates the database and tables.
2. `database/02_insert_sample_data.sql` — inserts sample data.
3. `database/03_queries.sql` — contains SQL queries.
4. `database/04_views.sql` — creates views.
5. `database/05_indexes.sql` — creates indexes.
6. `database/06_transactions.sql` — demonstrates transactions.
7. `database/07_procedures_functions.sql` — creates stored procedures and functions.
8. `database/08_triggers.sql` — creates triggers.

The MySQL database is named `satellite_geo_repository`.

Run the schema and sample-data scripts before the scripts that depend on the created tables. 

### 3. Start and Populate MongoDB

Make sure MongoDB is installed and running.

On Windows, start the MongoDB service if it is installed as a service:

```powershell
net start MongoDB
```

Alternatively, start the MongoDB server manually using `mongod` if it is not running as a service.

From the **project root**, run the population script:

```powershell
mongosh "database/mongodb/data.js"
```

This script:

- Selects the `satellite_geo_repository` MongoDB database.
- Drops and recreates the `observation_metadata` collection by inserting the sample documents.
- Inserts observation metadata, including satellite, sensor, location, image references, spectral information, quality metadata, and processing metadata.
- Creates indexes on observation ID, cloud cover, and satellite ID.
- Prints the inserted document count and indexes for verification.


To verify the populated collection:

```powershell
mongosh
```

Then run:

```javascript
use satellite_geo_repository
show collections
db.observation_metadata.countDocuments()
```

The MongoDB database and MySQL database have the same name, but they are separate databases.

### 4. Configure the Backend

Create `backend/.env` using `backend/.env.example` as the template.

Configure the following variables with your local values:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username (usually 'root')
DB_PASSWORD=your_mysql_password
DB_NAME=satellite_geo_repository

JWT_SECRET=your_long_random_secret (can be configured for your system in any way you want)

MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=satellite_geo_repository
```


### 5. Install and Start the Backend

Open a terminal from the project root:

```powershell
cd backend
npm install
node index.js
```

The API runs at:

`http://localhost:3001`

Keep this terminal running.

### 6. Configure and Start the Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
```

Create `frontend/.env` using `frontend/.env.example`. Set the backend URL:

```env
VITE_API_URL=http://localhost:3001/api
```

Start the development server:

```powershell
npm run dev
```

Open the local URL displayed by Vite.

## Authentication

The application uses JWT-based authentication and bcrypt password hashing.

- **USER:** Can access permitted read operations.
- **ADMIN:** Has additional permissions for operations allowed by the backend.

New registrations create regular user accounts. Administrator access is controlled by the backend's role-based authorization.

## API Routes

The backend exposes the following route groups:

- `/api/auth` — registration and login
- `/api/satellites` — satellite data
- `/api/observations` — observation data
- `/api/metadata` — MongoDB observation metadata
- `/api/provenance` — data-product provenance

## Running the Application

Before opening the frontend, ensure that:

1. MySQL is running and the SQL scripts have been executed.
2. MongoDB is running and `database/mongodb/data.js` has been executed.
3. The backend is running with valid environment configuration.
4. The frontend development server is running.

