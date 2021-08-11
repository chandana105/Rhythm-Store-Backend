const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;
const {isEmail , isAlpha , isStrongPassword} = require('validator')

var validatePassword = function(password) {
     if (!isStrongPassword(password)) {
    throw new HttpError(400, "Not a strong password");
  }
};

const UserSchema = new Schema({
  username : {
    type : String,
    unique : true,
    trim : true,
    required : "Cannot have a user without username , please enter username",
    minLength : [4 , "Username should be minimum of 4 characters"],
    maxLength : [20 , "Username can only have maximum of 20 characters"],
    validate : [isAlpha, "Username must have only alphabets"]
  },
  email : {
    type : String,
    unique : true,
    trim : true,
    index : true,
    required : 'Cannot enter a user without email, please enter email',
    validate: [ isEmail, 'Invalid Email format,please enter a valid email' ]

  },
  profileImage : mongoose.SchemaTypes.Url,
  password : {
    type : String,
    required : 'Cannot enter a user without password, please enter password',
    validate : [ /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/ , 'pls enter valid password']

    
  }
} , {
  timestamps : true
})

const User = mongoose.model("User" , UserSchema)

module.exports = { User }