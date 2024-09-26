import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost } from '../controllers/postControl.js';

const router = express.Router();


router.post('/create', verifyUser , createPost)

export default router;