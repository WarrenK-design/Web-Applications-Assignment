/// Imports ///
// app - The Express application 
// dotenv - Used for loding in the .env file 
// mongoConnect - Used for connecting to the database
import app from './app.js';
import dotenv  from 'dotenv';
import mongoConnect from './database/connection/db.js';

/// Setup ///
// Read in the .env into env vars
// Connect to the database 
// Set the PORT to listen on 
dotenv.config();
mongoConnect();
const PORT = process.env.PORT || 5000; 



//Start the server listening 
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));