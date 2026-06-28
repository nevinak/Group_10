import express from 'express';
import { login, logout, signup, getAllUsers, me } from '../controllers/user.controller.js';
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', secureRoute, me);
router.get('/allusers', secureRoute, getAllUsers);

export default router;
