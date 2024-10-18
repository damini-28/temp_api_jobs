require('dotenv').config()
require('express-async-errors')
const express=require('express')
const app=express()
const mongoose=require("mongoose")
//extra security

const helmet = require('helmet');
const cors =require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');

const connectDB=require('./starter/db/connect')
const authenticateUser=require('./starter/middleware/authentication')
//routes
const authRouter=require('./starter/routes/auth')
const jobsRouter=require('./starter/routes/jobs')
// error handler
const notFoundMiddleware=require('./starter/middleware/not-found')
const errorHandlerMiddleware=require("./starter/middleware/error-handler")

app.set('trust proxy',1);
app.use(express.json());
//app.use(helmet());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(
    rateLimiter({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
    }))


app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)
app.get("/",(req,res)=>{
    res.send('jobs api')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT||3000
//console.log("mongoDB URI", process.env.MONGO_URI)
const mongoURI = 'mongosh "mongodb+srv://jobapi.xoksb.mongodb.net/" --apiVersion 1 --username damini'
//'mongodb+srv://damini:1234@jobapi.xoksb.mongodb.net/?retryWrites=true&w=majority&appName=JOBAPI'

const start=async()=>{
    try{
         await connectDB(mongoURI)
         app.listen(port,console.log(`Server is listening on port ${port}...`))
        
    }catch(error){
        console.log(error)}
}

start()