import express from 'express'
import { deleteUser, updateUser, user } from '../controllers/userControl.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/', user);
router.put('/update/:userId',verifyUser, updateUser )
router.delete('/delete/:userId', verifyUser,deleteUser)


export default router;