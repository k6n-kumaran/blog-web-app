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