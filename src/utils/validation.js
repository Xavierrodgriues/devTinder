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

const validateEditProfileData = (req, res) => {
 
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "age", "gender", "about", "skills"];

    const isEditAllowed  = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;

}

const validateForgotPassword = (req, res) => {
    const allowedField = ["password"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedField.includes(field));
    return isEditAllowed;
}


module.exports = {
    validationSignUp,
    validateEditProfileData,
    validateForgotPassword
}