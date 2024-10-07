const express = require("express");
const userRouter = express.Router();
const {auth} = require("../../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connect } = require("mongoose");

const USER_SAFE_DATA = "firstName lastName age about gender skills"

// get all the pending connections requests of logged in users
userRouter.get("/user/requests/received", auth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", lastName]);

        if(!connectionRequest){
            res.status(200).json({message: "No request is there for you"})
        }

        res.status(200).json({message: "Data send successfully", data: connectionRequest})


    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", auth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser, status: "accepted"},
                {fromUserId: loggedInUser, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA); 

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)){ // or convert the idea into String using toString()
                return row.toUserId
            }
            return row.fromUserId
        });

        res.status(200).json({message: "Data sended", data: data});
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = { userRouter};