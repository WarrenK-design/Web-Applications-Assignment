/// Description:
//  Controller for the movie routes defined in /routes/moviesRoutes.js

/// Imports ///
// Movie   - Object model for the movie collection 
import Movie from '../models/movieModel.js';


/// Get /movies ///
// Description:
//  Route to return the movies from the database 
// Access Control:
//  Public Route
async function getMovies(req,res,next){
    try{
        // There is a limit of 20 movies per page 
        const limitPerPage = 20;
        const pageNumber   = req.params.pageNumber;
        const movies = await Movie.find({}).limit(limitPerPage).skip(limitPerPage*pageNumber);
        res.json(movies);
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not retrieve movies at this time please try again later"
        next(error);
    }
}


/// Get /movies/:id
// Description:
//  Route to get a specific movie by ID 
// Access Control:
//  Public 
async function getMovieById(req,res,next){
    try{
        const movie = await Movie.findById(req.params.id);
        res.json(movie);
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not retrieve the movie at this time please try again later"
        next(error);
    }
}

export {getMovies,getMovieById};