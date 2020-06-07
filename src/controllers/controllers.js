import fs from 'fs';
import { insertData, getData, getTotal } from '../database/data';

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
    const check = req.body.loadData;
    if (check === 'true') {
      for (const item of arr) {
        let reqData = fs.readFileSync(`src/${item}.json`)
        let data = JSON.parse(reqData)
         if (await getTotal(item) === data.length) {
          res.status(200).json({ message: 'Data has been loaded' })
        }
        await insertData(data, item)
      }
    res.status(201).json({ message: 'Data added to database' });
    } else {
      res.status(400).json({ message: 'No data was added to the database' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export {
  getRequestData,
  createRequestData,
};
