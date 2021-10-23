/// Imports ///
// express      - Package for running server 
// dotenv       - Used for reading in .env environment variables 
// mongoConnect - Function used for connecting to the mongodb database 
// errorHandler - Middleware for displaying custom error messages for api
import express from 'express';
import dotenv  from 'dotenv';
import mongoConnect from './database/connection/db.js';
import userRoutes from './routes/userRoutes.js'
import {errorHandler} from './middleware/errorMiddleware.js'

/// Setup ///
// Load the env vars 
// Connect to the database 
dotenv.config();
mongoConnect();

/// Variables ///
// app  - Express object for running server, adding middleware 
// PORT - The port to run the server on, get it from environemnt, no env then 5000 
const app  = express();
const PORT = process.env.PORT || 5000; 

/// Middleware ///
// express.json - This is a body parser for parsing JSON messages 
app.use(express.json());

/// Routes ///
app.use('/user',userRoutes);

/// Error MiddleWare ///
app.use(errorHandler);


//Start the server listening 
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
