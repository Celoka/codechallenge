const { getDatabase } = require('./mongo')

async function insertData(data, collectionName) {
    const database = await getDatabase();
    const { insertedId } = await database.collection(collectionName).insertMany(data);
    return insertedId;
}

async function getData(collectionName, page = 1, limit = 5) {
    const database = await getDatabase();
    return await database.collection(collectionName).find({})
                                                    .skip((page - 1) * limit)
                                                    .limit(limit * 1)
                                                    .toArray();
}

async function getTotal(collectionName){
    const database = await getDatabase();
    return await database.collection(collectionName).find({}).count();
}

module.exports = {
    insertData,
    getData,
    getTotal
};
