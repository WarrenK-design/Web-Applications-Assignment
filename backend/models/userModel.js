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
//      isAdmin(Boolean,required,default false) - Used for detecting admin of the site
//      myMovies(Array to Movie refs)           - Array which a user can add there favourite movies to 
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "default_profile_image.jpg"
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
    },
    myMovies:[
        {
            movie:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Movie'}
        }
    ]
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


/// hashPassword on save ///
// Description:
//  This function is called on the "save" action for the user schema
//  When a new user is created there password has to be hashed 
//  It should also be hashed when a password is changed  
//  Function s called on user so "this" can be used to access attributes 
userSchema.pre('save', async function (next) {
    // If the password is not modified do not run this, call next middleware 
    if(!this.isModified('password')){
        next();
    }else{
        // salt is a random string used to hash the password 
        let salt = await bcrypt.genSalt(10);
        // now hash the passowrd using the salt 
        this.password = await bcrypt.hash(this.password,salt);
    }
})

// User - This is the database model created using the defined schema 
const User = mongoose.model('User',userSchema);

export default User;