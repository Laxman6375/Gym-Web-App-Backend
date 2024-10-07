const mongoose = require('mongoose');
require("dotenv").config();

const ConnectDB = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=> console.log("DB connected successfully"))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    })
}

module.exports = ConnectDB;