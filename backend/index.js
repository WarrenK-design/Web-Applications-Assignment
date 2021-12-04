/// Imports ///
// express      - Package for running server 
// dotenv       - Used for reading in .env environment variables 
// mongoConnect - Function used for connecting to the mongodb database 
// errorHandler - Middleware for displaying custom error messages for api
// path         - Used for directory handling 
// cors      - Cross origin domain requests, used to accept request from differetn domain https://expressjs.com/en/resources/middleware/cors.html
import express from 'express';
import dotenv  from 'dotenv';
import mongoConnect from './database/connection/db.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import movieRoutes from './routes/moviesRoutes.js';
import {errorHandler} from './middleware/errorMiddleware.js'
import path from 'path';
import cors from 'cors';

/// Setup ///
// Load the env vars 
// Connect to the database 
dotenv.config();
mongoConnect();

/// Variables ///
// app       - Express object for running server, adding middleware 
// PORT      - The port to run the server on, get it from environemnt, no env then 5000 
// __dirname - Current directory 

const app  = express();
const PORT = process.env.PORT || 5000; 
const __dirname = path.resolve();

/// Cors ///
// Allow reuests from diffeernt sources 
app.use(cors())


/// Middleware ///
// express.json - This is a body parser for parsing JSON messages 
app.use(express.json());

/// Routes ///
app.use('/user',userRoutes);
app.use('/uploads',uploadRoutes);
app.use('/movies',movieRoutes);

/// Error MiddleWare ///
app.use(errorHandler);

// static folder - uploads folder needs to be available in the browser 
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))

//Start the server listening 
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
