import express from 'express';
import secureRoute from '../middleware/secureRoute.js';
import { deleteMessage, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/send/:id', secureRoute, sendMessage);
router.get('/get/:id', secureRoute, getMessages);
router.delete('/delete/:id', secureRoute, deleteMessage);

export default router;
