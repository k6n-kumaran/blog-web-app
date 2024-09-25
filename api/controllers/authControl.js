import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup =  async(req,res ,next) => {
    const {username,email,password} = req.body;

    if(!username || !email || !password || username === '' || email === "" || !password ==="" ){
      next(errorHandler(400,"All fields are required"))
    }


    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    })

    try {
         await newUser.save();

    res.json({message : "Successful"})
    } catch (error) {
        // res.status(500).json({message: error.message})
        next(error)
    }

   
    
}

export const signin = async(req,res,next) => {
    const {email,password} = req.body;

    if(!email  || !password || email === ''  || !password ==="" ){
        return next(errorHandler(400,"All fields are required"))
      }

    try {
        const validUser = await User.findOne({email})

        if(!validUser) {
          return  next(errorHandler(404 , "User not found.Try Sign up"))
        }

        const validPassword = bcryptjs.compareSync(password,validUser.password);

        if(!validPassword) {
          return  next(errorHandler(400, "Invalid Password"))
        }

        const token = jwt.sign({
            id: validUser._id,
        },process.env.SECRET_KEY)

        const {password : pass,  ...rest} = validUser._doc;

        res.status(200).cookie('access_key' , token,{
            httpOnly :true
        }).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req,res,next) => {
    const {email,name,photoURL} = req.body;

    try {
        const user = await User.findOne({email});
        if(user) {
            const token = jwt.sign ({ 
                id: user._id,
            },process.env.SECRET_KEY)

        // const {password,  ...rest} = user._doc;

        res.status(200).cookie('access_key' , token,{
            httpOnly :true
        }).json(user)
        } else{
            const generateRandomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const hashedPassword = bcryptjs.hashSync(generateRandomPass,10);



            const newUser = new User({
                username :  name.toLowerCase().split(' ').join("") + Math.random().toString(9).slice(-4),
                email,
                password : hashedPassword,
                photo : photoURL,
            })

            await newUser.save();
            const token = jwt.sign({
                id: newUser._id,
            },process.env.SECRET_KEY)

            // const {password,  ...rest} = newUser._doc;
    
            res.status(200).cookie('access_key' , token,{
                httpOnly :true
            }).json(newUser)


        }
    } catch (error) {
        next(error);
        
    }
}