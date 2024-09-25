const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require("./models/user")

// middleware to convert json
app.use(express.json());

// adding User to the database
app.post("/signup", async (req, res) => {
    const userObj = req.body;

    try{
        const user = new User(userObj);
        await user.save();
    
        res.send("Data stored")
    }catch(err){
        res.status(500).send("Failed to store data "+ err.message)
    }
    console.log(req.body);

    
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

