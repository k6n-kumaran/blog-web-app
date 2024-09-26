import Post from "../models/postModel.js";
import { errorHandler } from "../utils/error.js"

export const createPost =async (req,res,next) => {

    if(!req.user.isAdmin) {
        next(errorHandler(403,"You are not allowed to create a post"))
    }

    if(!req.body.title || !req.body.content) {
        next(errorHandler(400,"Please provide all fields"))
    }

    const slug = req.body.title.toLowerCase().replace(/ /g, "_");


    const newPost = new Post({
        ...req.body, slug,userId: req.user.id
    } )

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (error) {
        next(error)
    }
}