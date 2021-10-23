// Description: 
//  Contains the model for the user collection in the database, 
//  This defines the schema for interacting with the database 
import mongoose from 'mongoose';

// userSchema
//  Description:
//      This is the schema for the user collection in the mongodb database 
//  Fields:
//      name(string,required)                   - The users full name 
//      email(string,required,unique)           - Email address for the user   
//      password(string,required)               - Users password to login 
//      isAdmin(Boolean,required,default false) - Used for detecting admin of the site, 
const userSchema = mongoose.Schema({
    name: {
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

// User - This is the database model created using the defined schema 
const User = mongoose.model('User',userSchema);

export default User;