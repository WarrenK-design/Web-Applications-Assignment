/// Description:
//  This test suite is used for testing the functionality of the movie controller 
//  associated with the movie routes 

/// Imports ///
// request     - From the supertest mosudle, used to send http request in testing environment 
// express     - The backend API framework 
// userRouter  - The routes which we are testing  
import request from 'supertest';
import {jest} from '@jest/globals'
import app from '../../app.js';
import Movie from '../../models/movieModel.js' 
import * as gen from '../../utils/generateJWT.js';
import jwt from 'jsonwebtoken';
import movieData from './dummyData/movieData.js'
import { TestWatcher } from '@jest/core';


/// Test 1 ///
// Desription:
//  This test is for getting the movies  
// Route:
//  GET /movies:pageNumber
describe("GET /movies/:pageNumber",() =>{
    let movies;
    beforeEach(async () =>{
        Movie.find = jest.fn()
        Movie.find.mockReturnValue(movieData); 
        Movie.limit = jest.fn()
        Movie.limit.mockReturnValue(movieData);
        Movie.skip = jest.fn()
        Movie.skip.mockReturnValue(movieData);
    })

    describe("Obtaning all movies", () =>{
        // Get all the movies retruns 200
        test("Should return 200, all movies returned", async () =>{
            // Arrange 
            let mockRequest = {};
            // Act 
            const response = await request(app).get('/movies/0').send(mockRequest);
            // Assert
           // console.log(response)
            expect(response.statusCode).toBe(200);
            
        });
    })

    describe("Searching for movies",() =>{
        // Get a movie by category 

        // Get a movie by duration 

        // Get a movie by actor 
    })

    describe("Bad data",() =>{

    })

})




/// Test 2 ///
// Desription:
//  This test is for getting the movies by Id 
// Route:
//  GET /movies/byId/:id
describe("GET /movies/byId/:id",() =>{
    
})

/// Test 3 ///
// Desription:
//  This test is for getting posting movie reviews
// Route:
//  POST /movies/reviews/:id
describe("POST /movies/reviews/:id",() =>{
    
})


/// Test 4 ///
// Desription:
//  This test is for deleteing movie reviews
// Route:
//  DELETE /movies/reviews/:id
describe("DELETE /movies/reviews/:id",() =>{
    
})