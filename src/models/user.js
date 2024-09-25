
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    lastName :{
        type: String,
        minLength: 2,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong Password");
            }
        }
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        validate(value){
            if(!['male', "female", "others"].includes(value)){
                throw new Error("Incorrect input");
            }
        }
    },
},{
    timestamps: true
}
);

// const User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);