const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(mongoUrl);

let database;

async function connectMongo() {
    if (!database) {
        await client.connect();
        database = client.db(
            process.env.MONGO_DB_NAME || 'satellite_geo_repository'
        );

        console.log('MongoDB connected');
    }

    return database;
}

module.exports = connectMongo;