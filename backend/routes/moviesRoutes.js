/// Description:
//  This file holds all the route definitions for the /movies

/// Imports ///
// express - The express JS module for the server, required to get router object 
// protectedRoute - This middleware ensures a user is signed in 
import express from 'express';
import {getMovies,getMovieById} from '../controllers/movieController.js';

/// Variables ///
//  router - The router object attahced to the express server, used to define routes for the api 
const router = express.Router();

/// Routes ///

/// Get /movies ///
// Description:
//  Route to return the movies from the database 
// Access Control:
//  Public Route
router.get('/:pageNumber',getMovies);


/// Get /movies/:id ///
// Description:
//  Route to return a specific movie identified by its id 
// Access Control:
//  Public Route
router.get('/:id',getMovieById);




export default router;