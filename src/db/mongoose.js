import dotenv from "dotenv"
dotenv.config()
import * as mongoose from "mongoose";
// "mongodb://127.0.0.1:27017/local-market"
console.log(process.env.MONGOURL) 
mongoose.connect(process.env.MONGOURL,{
    useNewUrlParser:true 
}).then(()=>{
    console.log("Connected")
}).catch(e=>{
    console.log("error in connection",e)
})

