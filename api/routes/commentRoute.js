import express from 'express'
import { createComment } from '../controllers/commentControl.js';
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router();


router.post('/createcomment', verifyUser ,createComment )

export default router;