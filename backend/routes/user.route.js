import express from 'express';
import { login, logout, signup, getAllUsers, me, updateProfilePicture } from '../controllers/user.controller.js';
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', secureRoute, me);
router.get('/allusers', secureRoute, getAllUsers);
router.post('/profile-picture', secureRoute, updateProfilePicture);

export default router;
