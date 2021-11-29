/// Description:
//  This file holds all the route definitions for the /movies

/// Imports ///
// express - The express JS module for the server, required to get router object 
// getMovies        - Used for GET/:pageNumber
// getMovieById     - Used for GEt /byId/:id
// protectedRoute - This middleware ensures a user is signed in 
import express from 'express';
import {getMovies,getMovieById,postMovieReview,deleteMovieReview} from '../controllers/movieController.js';
import { protectdRoute } from '../middleware/authMiddleware.js';


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


/// Get /movies/byId/:id ///
// Description:
//  Route to return a specific movie identified by its id 
// Access Control:
//  Public Route
router.get('/byId/:id',getMovieById);


/// Post /movies/review/:id ///
// Description:
//  Route to post a review to a specific movie identified by its id 
// Access Control:
//  Private Route
router.post('/reviews/:id',protectdRoute,postMovieReview)


/// Delete /movies/review/:id ///
// Description:
//  Route to delete a review associated with a movie identified by its id
// Access Control:
//  Private Route
router.delete('/reviews/:id',protectdRoute,deleteMovieReview)




export default router;