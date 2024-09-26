import express from 'express'
import { updateUser, user } from '../controllers/userControl.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/', user);
router.put('/update/:userId',verifyUser, updateUser )


export default router;