/// Imports ///
// express      - Package for running server 
// errorHandler - Middleware for displaying custom error messages for api
// notFoundHandler - Middleware for handling a 404
// path         - Used for directory handling 
// cors      - Cross origin domain requests, used to accept request from differetn domain https://expressjs.com/en/resources/middleware/cors.html
import express from 'express';
import dotenv  from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import movieRoutes from './routes/moviesRoutes.js';
import {errorHandler,notFoundHandler} from './middleware/errorMiddleware.js'
import path from 'path';
import cors from 'cors';


/// Variables ///
// app       - Express object for running server, adding middleware 
// __dirname - Current directory 
const app  = express();
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

// static folder - uploads folder needs to be available in the browser 
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))


/// MiddleWare ///
//  errorHandler - Used for hanling reposnses to errors 
//  notFoundHandler - Used for handling 404's
app.use(notFoundHandler);
app.use(errorHandler);


export default app;
