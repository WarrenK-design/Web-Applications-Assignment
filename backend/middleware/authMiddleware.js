/// Description:
//  This file holds the middleware associated with authentication
//  For private routes a JWT has to be authenticated for the user to access that API route 
//  This middleware performs the authentication 

/// Imports ///
//  jwt  - Used for authenticating jwt 
//  User - Data object model for the user collection  
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


/// protectedRoute ///
// Description:
//  This middleware is used on protected API routes 
//  these routes require the user to pass a JWT for authentication
//  this function ensures that the token is present, the token is sent in authrosation header 
//  the users details are then set in the req.user object to be used in controllers 
async function protectdRoute(req,res,next) {
    try{
        if(req.headers.authorization ){//&& res.headers.authorization.startWith('Bearer')){
            // Get the token 
            let token = req.headers.authorization.split(' ')[1];
            // Decode the token 
            let decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
            // Find the users info and set it in request object, leave out password 
            req.user = await User.findById(decodedToken.id).select('-password');
            next();
        }else{
            // No token has been sent, throw error will be caight by try/catch block and sent to error middleware 
            throw new Error('No token sent to API for authorization');
        }
    }catch(error){
        // Set to unauthroised 
        res.status(401);
        // Pass error to middleware 
        next(error);
    }
};

export {protectdRoute};