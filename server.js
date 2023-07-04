import app from "./app.js";
import dotenv from "dotenv";
import connectToDb from "./config/database/database.js";
// imported our dotenv files containing secret Data
dotenv.config({path : 'config/secretKey.env'});


//connection to database 
connectToDb();


app.listen(process.env.PORT,(req,res,next)=>{
    console.log(`server is working on PORT = ${process.env.PORT}`)
})