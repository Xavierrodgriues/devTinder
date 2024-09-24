const auth = (req, res, next) => {
    const token = "xyz";

    if(token){
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
}

module.exports = {auth}