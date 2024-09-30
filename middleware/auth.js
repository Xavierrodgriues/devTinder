const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const token = await req.cookies.token;
        if (token) {
            const decoded = await jwt.verify(token, "devTinder$15");
            req.user = decoded;
            next();
        } else {
                throw new Error("Unauthorized user");
            }
    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {auth}