import express, { urlencoded } from 'express'
import './db/mongoose.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser' 
import User from '../models/user.js'
import cors from 'cors'
import dotenv from "dotenv"
const port =process.env.PORT||3000
const app=express()
app.use(cors({
    origin:"*",
    // credentials:true
})) 
dotenv.config()

app.use(cookieParser())
 
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 

const generateAuthToken=(email)=>{
    return jwt.sign({email},process.env.TOKEN)
}

async function getUser(email){
    try{
        const user=await User.findOne({email})
        return user;
    }
    catch{
        return undefined
    }
}


app.get("/",(req,res)=>{
    console.log("hello")
    res.send("hello")
})
app.post('/login',async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){  
        return res.send({success:false})
    }
    if(user.password!=req.body.password){
        console.log(user)
        return res.send({success:false})
    }
    // console.log(user)
    const token=generateAuthToken(user.email)
    console.log("token made:",token)

    // res.cookie('token',token,{
    //     httpOnly:true
    // }) 
    user.tokens.push({
        token:token
    })
    console.log(user)
    await user.save()
    res.send({success:true,token:token})
    
}) 

app.post('/register',async (req,res)=>{
    console.log(req.body)
    const user=new User(req.body)
    console.log(user)
    
    try{
    await user.save()
    console.log("hello")
    res.send({success:true,
    message:"registered"})
    }
    catch(e){ 
        console.log(e.message)
        res.send({success:false,message:e.message})
    }
})

app.get("/logout",async (req,res)=>{
    const token=req.headers.authorization
    if(!token){
        return res.send({success:false})
    }
    console.log("hello")
    try{
        const data=jwt.verify(token.replace("Bearer ",""),process.env.TOKEN)
        console.log(data)
        if(data.email){
            const user=await User.findOne({email:data.email})
            console.log(user)
            if(!user){
                return res.send({success:false,message:"user not found"}) 
            }
            user.tokens=user.tokens.filter((toke)=>{
                return toke.token!=token.replace("Bearer ","")
            })
            console.log(user)
            await user.save()
            return res.send({success:true,name:user.name})

        }

    }catch(e){
        return res.send({success:false,error:e.message})
    }
})
app.get("/checkauth",async(req,res)=>{
    // console.log(req.cookies.token)
    const token=req.headers.authorization
    if(!token){
        return res.send({success:false})
    }
    // console.log("hello")
    try{
        const data=jwt.verify(token.replace("Bearer ",""),process.env.TOKEN)
        console.log(data)
        if(data.email){
            const user=await User.findOne({email:data.email,'tokens.token':token.replace("Bearer ","")})
            if(!user){
                return res.send({success:false,message:"user not found"}) 
            }
            console.log(user)
            // console.log(user.createdAt)
            // console.log(new Date(user.updatedAt).getTime())
            return res.send({success:true,name:user.name,
            email:user.email})

        }

    }catch(e){
        return res.send({success:false,error:e.message})
    }
    // console.log(data) 
    

})
app.get("/check",async (req,res)=>{

    const token=req.headers.authorization
    console.log(token)
    if( token=="null") {
        return res.status(302).send({location:"http://127.0.0.1:5500"})
       
    } 
    
    const data=jwt.verify(token,process.env.TOKEN)
    console.log(data)
    try{

    const user=await User.findOne({email:data.email})
    if(!user){
        return res.send({error:"no data"})
    }
    return res.send({
        name:user.name
    })

    }catch(e){
        console.log(e)
    }


    res.send({error:"no token mila"})
    // console.log(token)
    // console.log(req.query)
    // res.send("done")
})
app.listen(port,()=>{
    console.log("server is up on Port ",port)
})