import express from 'express'
import mongoose from 'mongoose';
import env from 'dotenv'

const app = express();
env.config()

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log("Connected");  
}).catch((err) => {
    console.log(err);
})
const port = process.env.PORT;

app.listen(port,() => {
    console.log(`Server is running on ${port}`);
    
})