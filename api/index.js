import express from 'express'
import mongoose from 'mongoose';
import env from 'dotenv'
import userRoute from './routes/userRoute.js';
import auth from './routes/authRoute.js'

const app = express();
app.use(express.json());
env.config();

const port = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log("Database is Connected");  
}).catch((err) => {
    console.log(err);
})


app.use('/api/user', userRoute)
app.use('/api/auth',auth)


app.listen(port,() => {
    console.log(`Server is running on ${port}`);
    
})