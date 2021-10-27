/// Description:
//  Controller for the user routes defined in /routes/userRoutes.js

/// Imports ///
// User   - Object model for the user collection 
// genJWT - Function for generating a JSON webtokn for a user  
import User from '../models/userModel.js';
import {genJWT} from '../utils/generateJWT.js'

/// authUser ///
// Description:
//  This function authenticates a users email and password login details 
// Route:
//  POST /user/login
// Access Control:
//  Public Route 
async function authUser(req,res,next) {
    try{
        // Get the email and password sent in the body 
        let {email, password} = req.body;
        // Find the user 
        let user = await User.findOne({email})
        // Check if user is null, if it is pass error to middleware  
        if (user === null){
            // No user found for this email 
            res.status(401);
            next(new Error("No user found relating to this email"));
            return;
        }
        // Check if password matches, will be true or false 
        let passMatch = await user.validatePassword(password);
        // User found and password ok 
        if (user && passMatch){
            // Return user attributes and JWT access token 
            res.json({
                id: user._id,
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                isAdmin: user.isAdmin,
                jwt: genJWT(user._id) 
            })
        }else{ 
            // Password entered is invalid, throw an error which will be caught  
            res.status(401);
            next(new Error("Invalid password entry"));
            return;
        }
    }catch(error){
        // log the error then set the message to a general invalid statement 
        error.message = "Invalid email or password"
        res.status(401);
        next(error);
    }
}


/// getProfile ///
// Description:
//  This function is used to get the users personal profile information 
// Route:
//  POST /user/profile
// Access Control:
//  Private Route 
async function getProfile(req,res,next) {
    try{
        // Get the user using the req.user infor 
        let userInfo = await User.findById(req.user._id);
        // Check there is a user 
        if(userInfo){
            res.json({
                id: userInfo._id,
                firstName: userInfo.firstName,
                secondName: userInfo.secondName,
                email: userInfo.email,
                isAdmin: userInfo.isAdmin,
            })
        }else{
            // No user found, 404 no data found 
            res.status(404);
            next(new Error("No user data found"));
            return;
        }
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.status(500);
        next(error);
    }
}


/// regUser ///
// Description:
//  This function is used to register a new user 
// Route:
//  POST /user
// Access Control:
//  Public Route 
async function regUser(req,res,next) {
    try{
        // Get the users signup info from the body 
        let {firstName, secondName, email, password} = req.body;
        // Check if a user by this email already exists 
        let existingUser = await User.findOne({email});
        if (existingUser){
            // Bad email sent the user already exists 
            res.status(400);
            next(new Error("User with this email already exists"));
            return;
        }
        // Create the user 
        let user = await User.create({firstName,secondName,email,password});
        // Check was created succesfully 
        if(user){
            // 201 created response 
            res.status(201).json({
                id: user._id,
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                isAdmin: user.isAdmin,
                jwt: genJWT(user._id) 
            });
        }else{
            // User could not be created 
            res.status(400);
            next(new Error('User could not be created, invalid user data'));
            return;
        }
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.status(500);
        next(error);
    }
}


export {authUser,getProfile,regUser};