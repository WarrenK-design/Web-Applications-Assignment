/// Description:
//  This file holds all the definitions for the routes at the endpoint /user

/// Imports ///
// express - The express JS module for the server, required to get router object 
// 
// protectedRoute - This middleware ensures a user is signed in 
import express from 'express';
import {authUser,getProfile,deleteProfile,regUser,getProfileImage,postMyMovies,deleteMyMovies,putProfile} from '../controllers/userController.js';
import { protectdRoute } from '../middleware/authMiddleware.js';

/// Variables ///
//  router - The router object attahced to the express server, used to define routes for the api 
const router = express.Router();

/// Routes ///

/// POST /user ///
// Description:
//  Route for creating a new user  
// Access Control:
//  Public Route 
router.post('/',regUser);

/// POST /user/login ///
// Description:
//  Route hit when a user sends there login details to access the application, returns user details and JWT 
// Access Control:
//  Public Route 
router.post('/login',authUser);

/// GET /user/profile ///
// Description:
//  Route for getting a users personal profile information 
// Access Control:
//  Private Route 
router.get('/profile',protectdRoute,getProfile);

/// PUT /user/profile ///
// Description:
//  Route for updating a users profile 
// Access Control 
//  Private Route 
router.put('/profile',protectdRoute,putProfile)

/// DELETE /user/profile ///
// Description:
//  Route for deleteing a users profile
// Access Control 
//  Private Route 
router.delete('/profile',protectdRoute,deleteProfile)

/// GET /user/profileimage ///
// Description:
//  Route returns a users profile image 
// Access Control:
//  Private Route 
router.get('/profileimage',protectdRoute,getProfileImage);

/// POST /user/myMovies
// Description:
//  Route for adding a movie my movies 
// Access Control:
//  Private Route
router.post('/mymovies',protectdRoute,postMyMovies)

/// DELETE /user/myMovies
// Description:
//  Route for deleteing a movie from my movies 
// Access Control:
//  Private Route
router.delete('/mymovies',protectdRoute,deleteMyMovies)


export default router;