import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost, deletePosts, getPosts, updatePosts } from '../controllers/postControl.js';

const router = express.Router();

router.get('/posts' , getPosts)

router.post('/create', verifyUser , createPost)

router.delete('/deletepost/:postId/:userId',verifyUser, deletePosts)

router.put('/update/:postId/:userId',verifyUser, updatePosts)

export default router;