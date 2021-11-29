/// Description:
//      This script is used to seed data intially to the database. This data will be there to have an initial setup 
//      for the application.
/// WARNING:
//      This script is only intended to be run once before the application is ready to be launched.
//      It should only be run once to avoid duplication and deletion of data in the database. 
//      This script is run seperately from the server backend.   

/// Imports ///
//  mongoose - Object modelling tool for mongodb 
//  dotenv      - Used for reading in .env environment variables 
//  usersData    - Users data to be seeded to the database 
//  User        - The model for the users collection in the database 
//  Movie       - The model for the movie collection in the datbase 
//  movieData   - The data to insert into the movie collection 
//  mongoConnect - Function for connecting to the database 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersData from '../data/users.js';
import User from '../../models/userModel.js';
import Movie from '../../models/movieModel.js';
import movieData from '../data/movieData.js';
import mongoConnect from '../connection/db.js';


// Load environment variables from .env, needed for connection string in mongoConnect 
dotenv.config()
mongoConnect();

/// seedData ///
// Description:
//  This function seeds the data to the database for it to be availabale without manual entry from the frontend 
//  The data seeded to the database is first read from the database/data/ files. 
//  Note this function first deletes all data in the datbase so only run once before launch 
async function seedData() {
    try{
        // First delete all documents from the database collections 
        // Dont want to import data if there is already data in the database 
        await User.deleteMany();
        await Movie.deleteMany();
        // Now insert the documents using the models 
        await User.insertMany(usersData);
        await Movie.insertMany(movieData);
        // Display success message 
        console.log("Data succesfully seeded to the database")
        // Exit the process to stop 
        process.exit();
    }catch(error){
        // Could not delete/seed data to database  
        console.error(`Error in function seedData\nError:${error.message}`);
        // Exit with failure 
        process.exit(1);
    }
}

seedData();