const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');


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


module.exports = {
  getDatabase,
  startDatabase,
};
