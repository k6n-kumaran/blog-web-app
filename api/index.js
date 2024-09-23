import express from 'express'
import mongoose from 'mongoose';
import env from 'dotenv'
import userRoute from './routes/userRoute.js';
import auth from './routes/authRoute.js'

const app = express();
app.use(express.json());
env.config();

const port = process.env.PORT;
try {
    mongoose.connect(process.env.CONNECTION_STRING)
    console.log("Database is connected");
} catch (error) {
    console.log(error);   
}




app.use('/api/user', userRoute)
app.use('/api/auth',auth)


app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message =  err.message || "Internal server error"  
  
    res.status(statusCode).json({
      success : false,
      statusCode,
      message,
    })
  })


app.listen(port,() => {
    console.log(`Server is running on ${port}`);
    
})