import express from 'express'
import { createComment, deleteComment, getComment, likeComment } from '../controllers/commentControl.js';
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router();


router.post('/createcomment', verifyUser ,createComment )
router.get('/getcomments/:postId' ,getComment )
router.put('/likecomment/:commentId' ,verifyUser,likeComment )
router.delete('/deletecomment/:commentId' ,verifyUser,deleteComment )

export default router;