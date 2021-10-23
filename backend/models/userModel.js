// Description: 
//  Contains the model for the user collection in the database, 
//  This defines the schema for interacting with the database 

/// Imports ///
//  mongoose - Object data mapper library for mongodb 
//  bcrypt - Used for hashing the passowrds of the users, used in this file for checking hashing passwords 
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// userSchema
//  Description:
//      This is the schema for the user collection in the mongodb database 
//  Fields:
//      firstName(string,required)              - The users first name  
//      secondName(string,required)             - The users secondname 
//      email(string,required,unique)           - Email address for the user   
//      password(string,required)               - Users password to login 
//      isAdmin(Boolean,required,default false) - Used for detecting admin of the site, 
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true 
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: true
}
);

/// validatePassword ///
// Description:
//  Schema method used to check a password entered by the user 
//  all passwords stored are hashed using bcrypt and must be checked using package  
userSchema.methods.validatePassword = async function(password){
    // Check password, this method is schema method called on user model, 
    // "this" can be used to acces user attrirbutes, match will be true or false 
    let match = await bcrypt.compare(password, this.password);
    return match;
}




// User - This is the database model created using the defined schema 
const User = mongoose.model('User',userSchema);

export default User;