import express from 'express';
import { createRequestData, getRequestData } from '../../controllers/controllers';

const router = express.Router();

router.get('/data', getRequestData);
router.post('/data', createRequestData);

export default router;
