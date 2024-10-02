import { errorHandler } from "../utils/error.js";
import Comment from '../models/commentModel.js'

export const createComment = async (req,res,next) => {
    try {
         const {content,postId,userId} = req.body;

         if(userId !== req.user.id){
           return next(errorHandler(400,"You are not allowed to post a comment"))
         }

         const newComment = new Comment({
            content,
            postId,
            userId
         })
         await newComment.save()

         res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}


export const getComment = async (req,res,next) => {
  try {
    const comment = await Comment.find({postId : req.params.postId}).sort({
      createdAt : -1,
    })

    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

export const likeComment = async(req,res,next) => {
    try {
      const comment = await Comment.findById(req.params.commentId)
      if(!comment) {
        next(errorHandler(404,"Comment not found"))
      }

      const userIndex = comment.likes.indexOf(req.user.id);
      if(userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id)
      } else{
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex,1)
      }

      await comment.save()
      res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
}

export const deleteComment = async (req,res,next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if(!comment) {
     return next(errorHandler(404,"Comment Not Found"))
    }

    if(comment.userId !==  req.user.id && !req.user.isAdmin) {
      return next(errorHandler(404,"You are not allowed to delete this comment"))
    }

    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json("Comment has been deleted")
  } catch (error) {
    next(error)
  }
}