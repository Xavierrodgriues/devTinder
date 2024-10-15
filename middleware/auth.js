const jwt = require('jsonwebtoken');
const User = require("../src/models/user");

const auth = async (req, res, next) => {
    try{
        const cookies = await req.cookies;
        const { token } = cookies;
        // console.log(token)
        if(!token){
            return res.status(401).send("Please Login");
        }
        const msg = await jwt.verify(token, "devTinder$15");
        const user = await User.findById(msg._id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next()
    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {auth}