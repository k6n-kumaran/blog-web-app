import jwt from "jsonwebtoken";
import {errorHandler} from './error.js';


export const verifyUser = (req,res,next) => {
    const token = req.cookies.access_key;
    if(!token) {
        return next(errorHandler(401,"Unauthorised"))
    }


    jwt.verify(token,process.env.SECRET_KEY, (err,user) => {
        if(err) {
            return next(errorHandler(401,"Unauthorised"))
        }
        req.user = user;

        next();
    })
}