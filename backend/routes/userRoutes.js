/// Description:
//  This file holds all the definitions for the routes at the endpoint /user

/// Imports ///
// express - The express JS module for the server, required to get router object 
import express from 'express';
import {authUser,getProfile} from '../controllers/userController.js';


/// Variables ///
//  router - The router object attahced to the express server, used to define routes for the api 
const router = express.Router();

/// Routes ///

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
router.get('/profile',getProfile);


export default router;