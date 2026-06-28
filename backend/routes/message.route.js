import express from 'express';
import secureRoute from '../middleware/secureRoute.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/send/:id', secureRoute, sendMessage);
router.get('/get/:id', secureRoute, getMessages);

export default router;
