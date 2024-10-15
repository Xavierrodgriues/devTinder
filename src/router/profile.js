const express = require("express");
const profileRouter = express.Router();
const {auth} = require("../../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", auth, async (req, res) => {
    res.send(req.user);
});

profileRouter.patch("/profile/edit", auth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request")
        }else{
            
        }

        
        const LogedIn = req.user;
        Object.keys(req.body).forEach(field => LogedIn[field] = req.body[field]);
       await  LogedIn.save();
        res.json({
            message: `Profile of ${LogedIn.firstName} updated successfully`,
            data: LogedIn
        }); 

    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = {profileRouter};