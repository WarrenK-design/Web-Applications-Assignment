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


/// Get /movies/byId/:id
// Description:
//  Route to get a specific movie by ID 
// Access Control:
//  Public 
async function getMovieById(req,res,next){
    try{
        const movie = await Movie.findById(req.params.id).populate('reviews.reviewer','-profileImage -email -password -isAdmin -__v -createdAt -updatedAt');
        res.json(movie);
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not retrieve the movie at this time please try again later"
        next(error);
    }
}


// Description:
//      Used to post a review associated with a particular film 
//  Route:
//      POST /movies/reviews/:id
//  Access Control
//      Private Route      
async function postMovieReview(req,res,next){
    try{
        /// Get the comments and score from body, note score must be a string but saved as a number in mongo 
        let comments = req.body.comments;
        let score    = req.body.score;
        let headline = req.body.headline;
        
        /// Check that the comments and score has been sent 
        if(comments && score && headline){
            // Need to first find the movie 
            const movie = await Movie.findById(req.params.id);
            let review = {
                    reviewer:req.user._id,
                    comments:comments,
                    score:score,
                    headline:headline,
                    createdAt: Date.now()
                }
            // Push the new review to the Model
            await movie.reviews.push(review);
            let updatedMovie = await movie.save();
            // Return the updated movie with the new review
            res.json(updatedMovie);
        }else{
            // Bad data has been sent 
            res.status(400);
            res.errormessage = "Please check to ensure a comment and score has been given for the review";
            return next(new Error('The user has filled in the data wrong, a comment and score is required for the review'));
        }
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not process the comment at this time try again later"
        next(error);
    }
}


// Description:
//      Used to delete a review associated with a particular movie  
//  Route:
//      DELETE /movies/reviews/:id
//  Access Control
//      Private Route      
async function deleteMovieReview(req,res,next){
    try{
        /// The id of the review to be deleted should be send in the request body 
        let reviewId = req.body.reviewId;
        
        /// Check that the reviewId has been sent  
        if(reviewId && reviewId.length > 0){
            //// Need to first find the movie and review
            const movie   = await Movie.findById(req.params.id);
            const review = movie.reviews.id(reviewId);
            // Check there is a review associated with this id
            if(!review){
                res.status(404);
                res.errormessage = "No review associated with this Id found";
                return next(new Error('Theere is no record of the Id associated with a review'));
            }
            // Compare that the req.user._id object is equal to the review.reviewr object
            // i.e the person delteing the comment has to be the person who created the comment 
            if(req.user._id.equals(review.reviewer)){
                // Pull the review from the model and save 
                await movie.reviews.pull({_id:reviewId});
                let updatedMovie = await movie.save();
                res.json(updatedMovie);
            }else{
                res.status(401);
                res.errormessage = "Comment that does not belong to you cannot be deleted";
                return next(new Error('The user has attempted to delete a comment which does not belong to them'));
            }
        }else{
            // Bad data has been sent 
            res.status(400);
            res.errormessage = "Please check to ensure a review was selected to be deleted ";
            return next(new Error('Theere is no review ID deteccted in the body of the request, could be a problem with the request'));
        }
    }catch(error){
         // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Could not process the deleteion of the review please try again later"
        next(error);
    }
}

export {getMovies,getMovieById,postMovieReview,deleteMovieReview};