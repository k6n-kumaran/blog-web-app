import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const user = (req,res) => {
    res.json({message:"Api working fine."})
}

export const updateUser = async (req,res,next)  => {
    if(req.user.id !==  req.params.userId) {
        return next(errorHandler(401,"Your not allowed to update another user"))
    }
    if(req.body.password) {
        if(req.body.password.length < 6) {
        return next(errorHandler(401,"Password must be 6 characters"))
    }
    }

    req.body.password = bcryptjs.hashSync(req.body.password,10);
    
    if(req.body.username) {
        if(req.body.username.length < 7 || req.body.username.length >20) {
        return next(errorHandler(401,"Username must be between 7 and  20 characters"))
    }
    }
    if(req.body.username.includes(" ")) {
        return next(errorHandler(401,"Username cannot contains space"))
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId , {
            $set : {
                username : req.body.username,
                email : req.body.email,
                photo : req.body.photo,
                password : req.body.password
            }
        },{new: true})

        const {password,...rest} = updateUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


export const deleteUser = async(req,res,next) => {
    if(!req.user.isAdmin && req.user.id !==  req.params.userId) {
        return next(errorHandler(401,"Your not allowed to delete the another user account"))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("Deleted")
    } catch (error) {
        next(error)
    }
}

export const signout = (req,res,next) => {
    try {
        res.clearCookie('access_key').status(200).json("Sign out successfully")
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req,res,next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(401,"You are not allowed to see all users"))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === "asc" ? 1: -1 ;
        const users = await User.find().sort({updateAt : sortDirection}).skip(startIndex).limit(limit)

        const usersWOPassword = users.map((user) => {
            const {password, ...rest} = user._doc;
            return rest
         })

    const totalUsers = await User.countDocuments();

    const present = new Date()
    const oneMonthAgo  = new Date(
        present.getFullYear(),
        present.getMonth() - 1,
        present.getDate()
    )

    const lastMonthUsers = await  User.countDocuments(
        {createdAt : {$gte : oneMonthAgo}}
    )

    res.status(200).json({
        users:usersWOPassword,totalUsers,lastMonthUsers
    })
    } catch (error) {
        next(error)
    }
}