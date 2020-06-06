const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startDatabase } = require('./database/mongo');
const router = require('./routes');
const dotenv = require('dotenv');

const app = express();
dotenv.config()

const port = process.env.PORT || 3001;

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('combined'));

app.use(router);

startDatabase().then(async () => {
  app.listen(port, async () => {
    console.log(`listening on port ${port}`);
  });
});

module.exports = app;
