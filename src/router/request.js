const express = require("express");
const reqRouter = express.Router();
const {auth} = require("../../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

reqRouter.post("/request/send/:status/:toUserId", auth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid status: " + status,
                status: 400
            });
        }

        // Are you sending connection request to yourself ?


        // is the toUser exist in our Database ?
        const toUser = await User.findById(toUserId);
        if(!toUser){
            res.status(404).json({message: "User does not exist to send request"})
        }

        //is there existing connection request ?
        const findConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        })

        if(findConnectionRequest){
            return res.status(400).json({
                message: "Connection Already exists"
            })
        }



        const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status
        }) 

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " " + status + " " + toUser.firstName,
            data: data
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

reqRouter.post("/request/review/:status/:requestId", auth, async (req, res) => {

    // Akshay ==> ELon
    // Elon should be loggedin , it meand only elon should accept the req if the akshay send to ELon
    //status should be interested, if ignored u can;t do interest also
    try{
        const loggedInuser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: `${status} is not Allowed`})
        }

        const connectionRequest = await ConnectionRequest.findOne({_id: requestId, toUserId: loggedInuser._id, status:"interested"});
        if(!connectionRequest){
            return res.status(400).json({message: `${connectionRequest} is not found`})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message: `Request is ${status}`, data: data});


    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = {reqRouter};