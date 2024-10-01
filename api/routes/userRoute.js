import express from 'express'
import { deleteUser, getUsers, signout, updateUser, user } from '../controllers/userControl.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/', user);
router.put('/update/:userId',verifyUser, updateUser )
router.delete('/delete/:userId', verifyUser,deleteUser)
router.post('/signout', signout)
router.get('/getusers',verifyUser,getUsers)


export default router;