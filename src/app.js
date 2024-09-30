const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require("./models/user");
const {validationSignUp} = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const {auth} = require("../middleware/auth");

// middleware to convert json
app.use(express.json());

// middleware to read cookie
app.use(cookieParser());

// adding User to the database
app.post("/signup", async (req, res) => {
    
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
app.post('/login', async (req, res) => {
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
            const token = await jwt.sign({_id: user._id}, "devTinder$15", {expiresIn: '7d'});
            console.log(token);
            res.cookie("token", token);
            res.send("Login Success");
        }else{
            throw new Error("Password is invalid");
        }

    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

// get feed api
app.get("/feed", async (req, res) => {

    try{

        const user = await User.find();
        res.send(user);
      
    }catch(err){
        res.status(500).send("Failed to fetch data")
    }
    

});

app.get("/profile", auth, async (req, res) => {
    res.send("Accessed Profile Page");
});

app.get("/connection", auth, async (req, res) => {
    const _id = req.user;
    const user = await User.findById(_id);
    res.send(user.firstName + " Sended the request");
    // res.send(req.user);
})

// delete User from the database
app.delete("/deleteUser", async (req, res) => {
    const user = req.body;
    const response = await User.findByIdAndDelete(user)
    if(response){
        res.send("User deleted Successfully");
    }else{
        res.status(400).send("User not found");
    }
});

// Update data from database
app.patch("/updateUser", async (req, res) => {
    const user = req.body.id;
    const data = req.body;

    try{

    const updateAllowed = [
        "id", "firstName", "lastName", "password", "age", "gender"
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => updateAllowed.includes(k));

    if(!isUpdateAllowed){
        throw new Error("Failed to Update Data");
    }

    const response = await User.findByIdAndUpdate(user, data, {new: true, runValidators: true});
    res.send("User Details Updated");

}catch(err){
    res.status(400).send(err.message);
}
});


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

