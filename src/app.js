const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require("./models/user");
const cookieParser = require('cookie-parser');

// middleware to convert json
app.use(express.json());

// middleware to read cookie
app.use(cookieParser());


const {authRouter} = require("./router/auth");
const {profileRouter} = require("./router/profile");
const {reqRouter} = require("./router/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);

//connect database then listen server
connectDB()
.then(()=>{
    console.log("Database connected Successfully");

    app.listen(3000, ()=>{
        console.log('Listening on port 3000');
    });
    
})
.catch((err)=>{
    console.log("Database cannot be connected")
})

