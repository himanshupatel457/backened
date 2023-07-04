import mongoose from "mongoose";


const connectToDb = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Database Online ${connect.connection.host}`);
    }
    catch(err){
        console.log(`Some Error occured in MongoDB connection : ${err}`);
    }
} 

export default connectToDb;

//LcvSfOH6sMtNc9Bu  ecom-db