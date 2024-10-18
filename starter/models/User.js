const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,   
    },
    email:{
        type: String,
        required:[true,'Please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zZ\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                 'Please provide a valid email',
        ],
        unique:true,
    
    },
    password: {
        type:String,
        required:[true,'please provide password'],
        minlength:6,
    },
})

UserSchema.pre('save',async function (next) {
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    
})
UserSchema.methods.getName=function(){

    return jwt.sign({userID:user._id, name:user.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}
UserSchema.methods.comparePassword=async function (canditatePassword) {
    const isMatch=await bcrypt.compare(canditatePassword, this.password)
    return isMatch
    
}
module.exports=mongoose.model('User',UserSchema)
      