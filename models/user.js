import mongoose from "mongoose"


const tokenSchema = new mongoose.Schema({
    token: {
      type: String,
      required: true
    }
  },
  {
    timestamps:true
  });
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
    },
    number:{
        type:Number,
        trim:true
    },
    avatar:{
        type:Buffer
    },
    tokens:[{
      token:{
        type:String
      }}
    ]
    // tokens:[tokenSchema]
},{
  timestamps:true
})

const User=mongoose.model('User',userSchema)



export default User