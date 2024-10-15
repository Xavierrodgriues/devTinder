const express = require('express');
const authRouter = express.Router();
const {validationSignUp} = require("../utils/validation");
const User = require("../models/user");
const validator = require('validator');
const bcrypt = require('bcrypt');

// adding User to the database
authRouter.post("/signup", async (req, res) => {
    
    try{
        validationSignUp(req);
        const {firstName, lastName, emailId, age, gender} = req.body;
        // Encrypt password
        const password = req.body.password;
        const hashPassword = await bcrypt.hash(password, 10);


        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword,
            age,
            gender
    });
        await user.save();
    
        res.send("Data stored")
    }catch(err){
        res.status(500).send("Failed to store data "+ err.message)
    }
    console.log(req.body);

    
});

// login user 
authRouter.post('/login', async (req, res) => {
    const {emailId, password} = req.body;
    try{

        if(emailId == "" || password == ""){
            throw new Error("Input cant be Empty");
        }else if(!validator.isEmail(emailId)){
            throw new Error("Invalid email");
        }

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            const token = await user.genToken();
            // console.log(token);
            res.cookie("token", token);
            res.send(user);
        }else{
            throw new Error("Password is invalid");
        }

    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});


//logout user
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send();
})

module.exports = {authRouter};