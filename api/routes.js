const express = require('express')
const { createRequestData, getRequestData } = require('./controllers')

const router = express.Router()

router.get('/data', getRequestData);
router.post('/data', createRequestData);

module.exports = router;
