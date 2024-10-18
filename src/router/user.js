const express = require("express");
const userRouter = express.Router();
const {auth} = require("../../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age about gender skills photoUrl"

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
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){ // or convert the idea into String using toString()
                return row.toUserId
            }
            return row.fromUserId
        });
        console.log(data);

        res.status(200).json({message: "Data sended", data});
    }catch(err){
        res.status(400).send(err.message);
    }
});

userRouter.get("/user/feed", auth, async (req, res) => {

    // User should see all the users excpet
    // 1. Its self
    // 2. interested users
    // 3. ignored users
    // 4. his connections


    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;
        
        // Find all the connection req which is sended 
        // by the loggedin user or received by him

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        // .populate("fromUserId", "firstName") to view the firstname and the lastname instead of id
        // .populate("toUserId", "firstName");
        
        const hideUsersFromFeed = new Set();

        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // console.log(hideUsersFromFeed);

        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
       

        res.json({data: users});

    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = { userRouter};