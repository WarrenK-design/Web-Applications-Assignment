/// Imports ///
// request     - From the supertest mosudle, used to send http request in testing environment 
// express     - The backend API framework 
// userRouter  - The routes which we are testing  
import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/userRoutes';

// Create an instance of an express application 
const app = new express();

// Use the userRouter as these are the routes this file tests 
app.use('/user',userRouter);

// 