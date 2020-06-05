const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startDatabase } = require('./database/mongo');
const { insertData, getData, getTotal} = require('./database/data');
const run = require('../sheets')


const app = express();

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('combined'));

app.get('/data', async (req, res) => {
    try { 
        const {collection, page, limit } = req.query
        const pageNum = parseInt(page)
        const pageLimit = parseInt(limit)
        const count = await getTotal(collection)
        const data = await getData(collection, pageNum, pageLimit)
        res.status(200).json({
            data,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
});

app.post('/data', async(req, res) => {
    try {
        run()
        const check = req.body.loadData
        if (check === 'true') {
            const buyReqData = fs.readFileSync(path.join(__dirname, 'buyRequest.json'))
            const sellReqData = fs.readFileSync(path.join(__dirname, 'sellRequest.json'))
            const buy = JSON.parse(buyReqData);
            const sell = JSON.parse(sellReqData);
            await insertData(buy, 'buyRequest')
            await insertData(sell, 'sellRequest')
            res.status(201).json({ message: 'Data added to database' });
    } else {
        res.status(400).json({message: 'No data was added to the database'})
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

startDatabase().then(async () => {
    app.listen(3001, async () => {
        console.log('listening on port 3001');
    });
});
