import mongoose from "mongoose"


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
        type:String,

      },
      expiresAt: {
        type: Date,
        default: () => {
          // Set a default expiration time, such as 1 hour from the current time
          const expiration = new Date();
          expiration.setHours(expiration.getHours() + 1);
          return expiration;
        }
      }
    }
    ]
},{
  timestamps:true
})


userSchema.pre('save', async function (next) {
  const currentTime = new Date();
  console.log("before saving")
  this.tokens = this.tokens.filter(token => token.expiresAt > currentTime);
  next();
});
const User=mongoose.model('User',userSchema)



export default User