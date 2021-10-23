/// Imports ///
// express - Package for running server 
// dotenv  - Used for reading in .env environment variables 
// 
import express from 'express';
import dotenv  from 'dotenv';
import mongoConnect from './database/db.js';

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
app.use(express.json())

/// Routes ///

//Start the server listening 
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
