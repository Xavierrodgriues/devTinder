const mongoose = require('mongoose')

const connectDB = async()=>{

   await mongoose.connect('mongodb+srv://root:Xavier.00@atlascluster.yzp9rht.mongodb.net/devTinder')
}

module.exports = connectDB;
