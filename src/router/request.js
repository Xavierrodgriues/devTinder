const express = require("express");
const reqRouter = express.Router();
const {auth} = require("../../middleware/auth");

reqRouter.post("/sendConnectionRequest", auth, async (req, res) => {
    const user = req.user;
    console.log("sending connection request");

    res.send(user.firstName + "send connection request");
});


module.exports = {reqRouter};