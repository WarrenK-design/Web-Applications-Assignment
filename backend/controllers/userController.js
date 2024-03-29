/// Description:
//  Controller for the user routes defined in /routes/userRoutes.js

/// Imports ///
// User   - Object model for the user collection 
// genJWT - Function for generating a JSON webtokn for a user  
import User from '../models/userModel.js';
import {genJWT} from '../utils/generateJWT.js'
import path from 'path';
import fs from 'fs';

// Set the __dirname, using modules syntax so not available by efault 
const __dirname = path.resolve(); 

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
        // Check that data has been sent 
        if(typeof email ==='undefined' || typeof password === 'undefined'){
            // data is missing bad request 
            res.status(400);
            res.errormessage ="A email and password is required to log a user in";
            return next(new Error("The client has not sent the required email and password information"));
        }
        // Find the user 
        let user = await User.findOne({email}).populate('myMovies.movie')
        // Check if user is null, if it is pass error to middleware  
        if (user === null){
            // No user found for this email 
            res.status(404);
            res.errormessage = "No account linked with this email, please try again";
            return next(new Error("No user found relating to this email"));
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
                myMovies: user.myMovies,
                jwt: genJWT(user._id) 
            })
        }else{ 
            // Password entered is invalid, throw an error which will be caught  
            res.status(401);
            res.errormessage= "Invalid password, please try again";
            return next(new Error("Invalid password entry"));
        }
    }catch(error){
        // If this statement is reached then it is an intrnal serer error that needs to be invesstigated 
        // Set a user message to be displayed
        console.log(error)
        res.errormessage = "Could not authenticate user at this time, sorry try again later"
        return next(error);
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
        let userInfo = await User.findById(req.user._id).populate('myMovies.movie','-password');
        // Check there is a user 
        if(userInfo){
            res.json(userInfo); 
        }else{
            // No user found, 404 no data found 
            res.status(404);
            res.errormessage = "Profile could not be found at this time, try again later";
            return next(new Error("User model could not find a user with specified ID but no error thrown, check for datbase issues"));
        }
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not retrieve users profile at this time, sorry try again later"
        next(error);
    }
}


/// deleteProfile ///
// Description:
//  This is used to delete a users profile
// Access Control:
//  Private Route 
async function deleteProfile(req, res, next){
    try{
        // First get the users details
        let user = await User.findById(req.user._id);
        // If the profile image is not the deafult stock photo, delete there personal photo 
        if(user.profileImage != "default_profile_image.jpg"){
            let imagePath = `${__dirname}/uploads/profileImages/${user.profileImage}`;
            // Just ensure the file exists 
            if (fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath);
            }
        }
        // Delete the user in the database
        let deletedUser = await User.findByIdAndRemove(req.user._id);
        res.json({
            message: `User ${deletedUser.email} has been deleted`
        })
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not delete user profile at this time, please try again later"
        next(error);
    }
}


/// putProfile ///
// Description:
//  This function is used to update the users profile 
// Route:
//  PUT /user/profile
// Access Control:
//  Private Route 
async function putProfile(req,res,next) {
    try{
        // Get the user using the req.user infor 
        let user = await User.findById(req.user._id)
        // Check there is a user 
        if(user){
            // In the body of the request will be the  updates for each field 
            // Check if these parameters exists, if they dont leave them as they where 
            user.firstName  = req.body.firstName || user.firstName;
            user.secondName = req.body.secondName || user.secondName;
            user.email      = req.body.email     || user.email;
            // Check if a password was sent, need a check as there is no point in rehasing if it hasnt been sent 
            // Even if it hasnt been changed, when you assign it same value it will cause hashing to run again hashing 
            // the previously stored value again which is needless 
            if(req.body.password){
                user.password = req.body.password
            };
            // Save the user, on save will call the middle ware to hash password if it has changed 
            await user.save()
            // user.save() will not populate movies, we want movies populated for frontend, get them 
            let updatedUser = await User.findById(req.user._id).populate('myMovies.movie')
            // Return user attributes and gen JWT, 204 entity updated 
            res.json({
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                secondName: updatedUser.secondName,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                myMovies: updatedUser.myMovies,
                jwt: genJWT(updatedUser._id) 
            })
        }else{
            // No user found, 404 no data found 
            res.status(404);
            res.errormessage = "No reference to the user in the system";
            return next(new Error("The requested updte of the users profile could not be completed as no user was found relating to the user id"));
        }
    }catch(error){
        console.log(error);
        // Check if it is a duplicate key error, means user is trying to update email to one which already exists 
        if(error.name === 'MongoServerError' && error.code ===11000){
            // Email already has an entry, 409 conflict 
            res.status(409);
            res.errormessage = "A user with this email already exists within the system";
            next(error);
        }else{
            // If this block is reached then there is a server error 
            res.errormessage = "Could not update users profile at this time, sorry try again later"
            next(error);
        }
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
        // Check that data has been sent 
        if(typeof firstName ==='undefined' || typeof secondName === 'undefined' || typeof email === 'undefined' || typeof password ==='undefined'){
            // data is missing bad request 
            res.status(400);
            res.errormessage ="A first name, second name, email and password is required to register a user";
            return next(new Error("The client has not sent the required information to register the user"));
        }
        // Check if a user by this email already exists 
        let existingUser = await User.findOne({email});
        if (existingUser){
            // Bad email sent the user already exists 
            res.status(400);
            res.errormessage = "A user with this email already exists, try a different email";
            return next(new Error("User model found a entry in the database which is associated to the email supplied"));
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
                myMovies: user.myMovies,
                isAdmin: user.isAdmin,
                jwt: genJWT(user._id) 
            });
        }else{
            // User could not be created 
            throw new Error('The create command on the database has been executed but no created user returned');
         //   res.status(500);
           // res.errormessage = "Please check to ensure all fileds are correct, user could not be created";
           // return next(new Error('The user model could not create a user but did not throw an error, could possibly be database issue'));
        }
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "User could not be registered at this time, sorry try again later"
        res.status(500);
        next(error);
    }
}


/// getProfileImage ///
// Description:
//  This function return a users profile image 
// Route:
//  GET /user/profileimage
// Access Control:
//  Private Route 
async function getProfileImage(req,res,next) {
    try{
        // Get the reference to the users profile image in database  
        let userProfileRef = await User.findById(req.user._id,'profileImage').exec(); 
        // Check if there is a profileImage associated with this user 
        if (userProfileRef.profileImage){
            let imagePath = `${__dirname}/uploads/profileImages/${userProfileRef.profileImage}`;
            res.sendFile(imagePath) 
        }else{
            // No profile image associated with this user 
            // Sending back the default profile image and using a 200 code,
            // reason I am using a 200 code is the request was fine and no errors there was just no data,
            // if I wasnt sending back the default image id use 204 "No data code" but since there is something being sent back
            // I cant use this as a 204 specifies nothings is being sent in the body  
            let imagePath = `${__dirname}/uploads/profileImages/default_profile_image.jpg`;
            res.sendFile(imagePath);
        }
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not retrieve the users profile image at this time"
        next(error);
    }
}




/// postMyMovies ///
// Description:
//  This function adds a new movie to a users myMovies array associated with the user 
// Route:
//  POST /user/mymovies
// Access Control:
//  Private 
async function postMyMovies(req,res,next){
    try{
        /// Get the movie id from the request body -> movie id only sent as reference is stored look at user model
        // movieExists - Used to set flag if movie already exists in database
        let movieId = req.body.movieId;
        let movieExists = false; 
        /// Check that the movieId has been sent 
        if(movieId){
            // Get the user 
            let user = await User.findById(req.user._id);
            user.myMovies.map(movieObj => {
                // If this movie is already in the users myMovies dont add it again 
                if(movieId == movieObj.movie.toString()){
                    // Set the falg to true and return from map 
                    movieExists = true;
                    return
                }
            })
            // If movieExists then need to return here dont add duplicate 
            if(movieExists){
                // Movie already in the myMovies collection, 409 => Conflict 
                res.status(409);
                res.errormessage = "This movie already exists within your movie collection";
                return next(new Error('The movie Id sent already has an entry within the users my movie section'));
            }else{
                // Create document to be added to myMovies 
                let newMovie = {movie: movieId};
                // Push the new review to the Model
                await user.myMovies.push(newMovie);
                let updatedUser = await user.save();
                // Will not populate on save if want populated movies need another db call 
                const updatedMovies =  await User.findById(req.user._id).select('myMovies').populate('myMovies.movie');;
                res.json(updatedMovies);
            }
        }else{
            // Bad data has been sent 
            res.status(400);
            res.errormessage = "Please check to ensure that a movie has been selected to be added";
            return next(new Error('The movie ID is not being detected in the http request body, possibly error with parser or the request from front end'));
        }
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not add this movie to your movies at this time please try again later"
        next(error);
    }
}

/// deleteMyMovies ///
// Description:
//  This function deletes a movie from the mymovies section identified by movie id sent in body 
// Route:
//  DELETE /user/mymovies
// Access Control:
//  Private 
async function deleteMyMovies(req,res,next){
    try{
        /// Get the movie id from the request body -> movie id only sent as reference is stored look at user model
        /// objId - This is the object id which the movie is associated with in the myMovies array 
        let movieId = req.body.movieId;
        let objId   = "";
        /// Check that the movieId has been sent 
        if(movieId){
            // Get the user object 
            const user = await User.findById(req.user._id);
            // Get the objId for the target movie 
            user.myMovies.map(movieObj => {
                // If the movie is found in users myMovies get the ID 
                if(movieId == movieObj.movie.toString()){
                    // Set the id, used to delete the object 
                    objId = movieObj._id;
                    return
                }
            })
            // Record of movie selected to be deleted is in myMovies section 
            if(objId){
                // Pull the movie from the myMovies array using the objId, save the user and return result 
                await user.myMovies.pull(objId);
                await user.save();
                // Will not populate on save if want populated movies need another db call 
                const updatedMovies =  await User.findById(req.user._id).select('myMovies').populate('myMovies.movie');;
                res.json(updatedMovies);
            }else{
                // No movie with that id has been found 
                res.status(404);
                res.errormessage = "Please ensure the selected movie to be deleted is in your movie section";
                return next(new Error('There is no record of the movie ID selected to be deleted associated with the user'));
            }
        }else{
            // Bad data has been sent 
            res.status(400);
            res.errormessage = "Please check to ensure a movie has been selected to be deleted";
            return next(new Error('The movie ID is not being detected in the http request body, possibly error with parser or the request from front end'));
        }
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not delete this movie from your movies at this time please try again later"
        next(error);
    }
}

export {authUser,getProfile,regUser,getProfileImage,postMyMovies,deleteMyMovies,putProfile,deleteProfile};