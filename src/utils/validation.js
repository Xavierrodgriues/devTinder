const validator = require('validator');

const validationSignUp = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(firstName == '' && lastName == ''){
        throw new Error("Name cannot be empty");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password should be Strong");
    }
};


module.exports = {
    validationSignUp
}