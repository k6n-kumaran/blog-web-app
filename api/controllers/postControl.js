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

export const getPosts = async(req,res,next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === "asc" ? 1: -1 ;
        const posts = await Post.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.category && {category : req.query.category}),
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchTerm && {
                $or : [
                    {title : {$regex : req.query.searchTerm , $options : "i"}},
                    {content : {$regex : req.query.searchTerm , $options : "i"}},
                ]
            })
    }).sort({updateAt : sortDirection}).skip(startIndex).limit(limit)

    const totalPosts = await Post.countDocuments();

    const present = new Date()
    const oneMonthAgo  = new Date(
        present.getFullYear(),
        present.getMonth() - 1,
        present.getDate()
    )

    const lastMonthPosts = await  Post.countDocuments(
        {createdAt : {$gte : oneMonthAgo}}
    )

    res.status(200).json({
        posts,totalPosts,lastMonthPosts
    })
    } catch (error) {
        next(error)
    }
}

export const deletePosts  = async (req,res,next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to delete this post"))
    }

    try {
        await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json("Post has been deleted")
    } catch (error) {
        next(error)
    }
}

export const updatePosts = async (req,res,next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to update this post"))
    }

    try {
        const updatedPost =await Post.findByIdAndUpdate(req.params.postId , {
            $set : {
                title : req.body.title,
                content : req.body.content,
                category : req.body.category,
                photo : req.body.photo
            }
        },{new : true})
        res.status(200).json(updatedPost)
    } catch (error) {
        next(error)
    }
}