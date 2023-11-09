import mongoose from "mongoose";

export default function connectDB(){
    const url = "mongodb://127.0.0.1:27017/chatdb";

    try{
        mongoose.connect(url);
    }catch(err:any){
        console.log(err.message);
    }

    const dbConnection = mongoose.connection;
    dbConnection.once("open",()=>{
        console.log(`Database Connected: ${url}`)
    });

    dbConnection.on("error",()=>{
        console.error(`Connection Error: ${url}`);
    });

}