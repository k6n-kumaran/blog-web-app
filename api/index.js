import express from 'express'
import mongoose from 'mongoose';
import env from 'dotenv'
import userRoute from './routes/userRoute.js';

const app = express();
env.config()

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log("Database is Connected");  
}).catch((err) => {
    console.log(err);
})
const port = process.env.PORT;

app.use('/', userRoute)


app.listen(port,() => {
    console.log(`Server is running on ${port}`);
    
})