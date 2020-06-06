const fs = require('fs');
const path = require('path');

const { insertData, getData, getTotal } = require('./database/data');
const run = require('../sheets');

/**
 * @description This controller gets buy or sell request per string supplied
 *
 * @param {object} req request object
 * @param {object} res response object
 *
 * @return {object} return an object containing the data object and paginated response
 */
async function getRequestData(req, res) {
  try {
    const { collection, page, limit } = req.query;
    const pageNum = Number(page);
    const pageLimit = Number(limit);
    const count = await getTotal(collection);
    const data = await getData(collection, pageNum, pageLimit);
    res.status(200).json({
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}


/**
 * @description This controller creates buy or sell request. Pulls data from the google
 * sheet and populates the DB.
 *
 * @param {object} req request object
 * @param {object} res response object
 *
 * @return {object} return an object containing success or error message
 */
async function createRequestData(req, res) {
  const arr = ['buyRequest', 'sellRequest']
  try {
    await run();
    const check = req.body.loadData;
    if (check === 'true') {
      for (i = 0; i < arr.length; i++){
        let reqData = fs.readFileSync(path.join(__dirname, `${arr[i]}.json`))
        let data = JSON.parse(reqData)
        await insertData(data, arr[i])
      }
      res.status(201).json({ message: 'Data added to database' });
    } else {
      res.status(400).json({ message: 'No data was added to the database' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getRequestData,
  createRequestData,
};
