import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';

let database = null;

const { MONGODB_URI } = process.env;
dotenv.config();

async function startDatabase() {
  const mongo = new MongoMemoryServer();
  const mongoDBURL = await mongo.getConnectionString();
  const connection = await MongoClient.connect(mongoDBURL || MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

export {
  getDatabase,
  startDatabase,
};
