import { getDatabase } from './mongo';

async function insertData(data, collectionName) {
  const database = await getDatabase();
  await database.collection(collectionName).insertMany(data)
    .then((result) => {
      console.log(`Successfully inserted ${result.insertedCount} items!`);
      return result;
    })
    .catch((err) => console.error(`Failed to insert documents: ${err}`));
}

async function getData(collectionName, page = 1, limit = 5) {
  const database = await getDatabase();
  return await database.collection(collectionName).find({})
    .skip((page - 1) * limit)
    .limit(limit * 1)
    .toArray();
}

async function getTotal(collectionName) {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).count();
}

export { insertData, getData, getTotal };
