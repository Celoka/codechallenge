import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { startDatabase } from './database/mongo';
import router from './routes';

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

