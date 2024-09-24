const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require("./models/user")

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Xavier",
        lastName: "Rodgriues",
        emailId: "xavier@gmail.com",
        password: "12345",
        age: 21,
        gender: "Male",
    };

    try{
        const user = new User(userObj);
        await user.save();
    
        res.send("Data stored")
    }catch(err){
        res.status(500).send("Failed to store data "+ err.message)
    }
});

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

