const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    weight:{
        type: Number,
    },
    height:{
        type: Number,
    },
    age:{
        type: Number,
    },
    role:{
        type: String,
        enum:['User','Admin'],
        default:'User'
    },
    isVerified:{
        type: Boolean,
        default:false
    }
})

module.exports = mongoose.model('User',userSchema);