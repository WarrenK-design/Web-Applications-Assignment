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
import User from '../../models/userModel.js';
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
    // Dont care about database calls
    beforeEach(async () =>{
        Movie.find = jest.fn()
        Movie.find.mockReturnValue(movieData); 
        movieData.limit = jest.fn()
        movieData.limit.mockReturnValue(movieData);
        movieData.skip = jest.fn()
        movieData.skip.mockReturnValue(movieData);
        movieData.sort = jest.fn()
        movieData.sort.mockReturnValue(movieData);
    })

    describe("Obtaning all movies", () =>{
        // Get all the movies retruns 200
        test("Should return 200, all movies returned", async () =>{
            // Arrange 
            let mockRequest = {};
            // Act 
            const response = await request(app).get('/movies/0').send(mockRequest);
            // Assert
            console.log(response.body)
            expect(response.statusCode).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(movieData));
        });
    })

    describe("Searching for movies",() =>{
        // Get a movie by year 
        test("Should return 200, movie year sepecified", async () =>{
            // Arrange 
            let mockRequest = {category:"year",keyword:"2000"};
            // Act 
            const response = await request(app).get('/movies/0').query(mockRequest);
            // Assert
            expect(response.statusCode).toBe(200);
            expect(movieData.sort.mock.calls.length).toBe(1);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(movieData));
        });
        // Get a movie by duration 
        test("Should return 200, movie duration sepecified", async () =>{
            // Arrange 
            let mockRequest = {category:"duration",keyword:"100"};
            // Act 
            const response = await request(app).get('/movies/0').query(mockRequest);
            // Assert
            expect(response.statusCode).toBe(200);
            expect(movieData.sort.mock.calls.length).toBe(1);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(movieData));
        });
        // Get a movie by string category  
         test("Should return 200, string category sepecified", async () =>{
            // Arrange 
            let mockRequest = {category:"actor",keyword:"Tom Hanks"};
            // Act 
            const response = await request(app).get('/movies/0').query(mockRequest);
            // Assert
            expect(response.statusCode).toBe(200);
            expect(movieData.sort.mock.calls.length).toBe(1);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(movieData));
        }); 
    })
       

    describe("Bad data",() =>{
        // Internal server error 
        test("Should return 500, error thrown in database", async () =>{
            // Arrange 
            let mockRequest = {};
            movieData.skip.mockImplementation(()=>{throw new Error("Database error")})
            // Act 
            const response = await request(app).get('/movies/0').query(mockRequest);
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not retrieve movies at this time please try again later");
        }); 
    })
})




/// Test 2 ///
// Desription:
//  This test is for getting the movies by Id 
// Route:
//  GET /movies/byId/:id
describe("GET /movies/byId/:id",() =>{
    // Dont care about database calls 
   beforeEach(async () =>{
        Movie.findById = jest.fn()
        Movie.findById.mockReturnValue(movieData); 
        movieData.populate = jest.fn()
        movieData.populate.mockReturnValue(movieData);
    }) 
    // Good data sent and retirend 
    describe("Correct request sent",() => {
        // Movie Id sent and movie data retriened 
        test("Should be 200, movie data returned", async () =>{
            // Arrange
            let mockRequest = {};
            // Act
            const response = await request(app).get('/movies/byId/10').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(movieData));
        })
    })
    // BAd data sent 
    describe("Bad data sent to the backend", () =>{
        // Internal server error
        test("Should return 500, error in retrieving movie from database", async() =>{
              // Arrange
            let mockRequest = {};
            Movie.findById.mockImplementation(()=>{throw new Error("Database error")})
            // Act
            const response = await request(app).get('/movies/byId/10').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not retrieve the movie at this time please try again later");
        })
    })
})

/// Test 3 ///
// Desription:
//  This test is for getting posting movie reviews
// Route:
//  POST /movies/reviews/:id
describe("POST /movies/reviews/:id",() =>{
    let mockUser;
   // Dont care about database calls 
   beforeEach(async () =>{
        /// Mock the Auth middleWare 
        mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:"StarWars"}
        jwt.verify = jest.fn();
        jwt.verify.mockReturnValue("decodedToken");
        User.findById = jest.fn().mockImplementation(() => { return mockUser});
        mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
        mockUser.save = jest.fn();
        mockUser.populate = jest.fn().mockImplementation(() => {return mockUser});

        // Now mock the functional part in controller
        Movie.findById = jest.fn()
        Movie.findById.mockReturnValue(movieData); 
        movieData.reviews = [{"reviewer":1,"headline":"Great movie","comments":"Really good film","score":10},]
        movieData.save = jest.fn()
    })     

    /// Good data sent 
    describe("Correct request sent", () =>{
        // Review succefully added 
        test("Should return 200", async() =>{
            // Arrange 
            let mockRequest={comments:"Movie was good",score:10,headline:"Great Film"}
            movieData.reviews.push = jest.fn();
            movieData.reviews.push.mockReturnValue(movieData);
            movieData.save.mockReturnValue("Review Added")
            // Act
            const response = await request(app).post('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body).toBe("Review Added");
        })
    })

    /// Bad data sent 
    describe("Incorrect data sent", () =>{
        /// No comments, score and headline sent 
        test("Should return 400, no comments,score or headline", async() =>{
            // Arrange
            let mockRequest={}            
            // Act
            const response = await request(app).post('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure a comment and score has been given for the review");            

        })
        // No comments sent 
        test("Should return 400, no comments sent", async() =>{
            // Arrange
            let mockRequest={score:10,headline:"Great Film"}   
             // Act
            const response = await request(app).post('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure a comment and score has been given for the review");                                 
        })
        // No score sent 
        test("Should return 400, no score sent", async() =>{
            // Arrange
            let mockRequest={comments:"Movie was good",headline:"Great Film"}                        
            // Act
            const response = await request(app).post('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure a comment and score has been given for the review");                
        
        })
        // No headline sent
        test("Should return 400, no headline sent", async() =>{
            // Arrange
            let mockRequest={comments:"Movie was good",score:10}  
             // Act
            const response = await request(app).post('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure a comment and score has been given for the review");                                  
            })
        // Internal server error
        test("Should return 500, database threw an error", async() =>{
            // Arrange
            let mockRequest={comments:"Movie was good",score:10,headline:"Great Film"}
            Movie.findById.mockImplementation(()=>{throw new Error("Database error")});
             // Act
            const response = await request(app).post('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not process the comment at this time try again later");                                  
            })

        })


    
})


/// Test 4 ///
// Desription:
//  This test is for deleteing movie reviews
// Route:
//  DELETE /movies/reviews/:id
describe("DELETE /movies/reviews/:id",() =>{
    let mockUser;
    // Dont care about database calls 
   beforeEach(async () =>{
        /// Mock the Auth middleWare 
        mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:"StarWars"}
        jwt.verify = jest.fn();
        jwt.verify.mockReturnValue("decodedToken");
        User.findById = jest.fn().mockImplementation(() => { return mockUser});
        mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
        mockUser.save = jest.fn();
        mockUser.populate = jest.fn().mockImplementation(() => {return mockUser});

        // Now mock the functional part in controller
        Movie.findById = jest.fn()
        Movie.findById.mockReturnValue(movieData); 
        mockUser._id = {objectID:"1"};
        movieData.reviews = [{"reviewer":1,"headline":"Great movie","comments":"Really good film","score":10},]
        movieData.reviews.id = jest.fn();
        movieData.save = jest.fn()
        movieData.save.mockReturnValue(movieData);
    }) 
    // Good data sent 
    describe("Correct request sent",() =>{
        // Correct data sent review deleted 
        test("Should be 200, review deleted", async () =>{
            // Arrange
            let mockRequest = {reviewId:"123"}; 
            movieData.reviews.id.mockImplementation(()=>{return movieData.reviews[0]})
            movieData.reviews.pull = jest.fn().mockImplementation(()=>{return movieData});
            mockUser._id.equals = jest.fn().mockReturnValue(true)
            // Act
            const response = await request(app).delete('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(movieData));
        })
    })
    // Bad data sent
    describe("Bad request sent",() =>{
        // No review ID sent 400
        test("Should be 400, no reviewID sent", async () =>{
            // Arrange
            let mockRequest = {reviewId:''};
            // Act 
            const response = await request(app).delete('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure a review was selected to be deleted");
        })
        // Review ID sent but no review associated to this movie with that ID
        test("Should return 404, review ID sent but not associated to movie", async () =>{
            // Arrange
            let mockRequest = {reviewId:'1'};
            movieData.reviews.id.mockReturnValue('');
            // Act
            const response = await request(app).delete('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(404);
            expect(response.body.errormessage).toBe("No review associated with this Id found");
        })
        // Review ID sent but review does not belong to user
        test("Should return 401, review ID sent but review does not belong to user", async () =>{
            // Arrange
            let mockRequest = {reviewId:'1'};            
            movieData.reviews.id.mockReturnValue('ReviewFound');
            mockUser._id.equals = jest.fn().mockReturnValue(false)
            // Act 
            const response = await request(app).delete('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);                        
            // Asset
            expect(response.statusCode).toBe(401);
            expect(response.body.errormessage).toBe("Review that does not belong to you cannot be deleted");
        })
        // Server Error 
        test("Should return 500, database threw an error", async () =>{
             // Arrange
            let mockRequest = {reviewId:'1'};            
            Movie.findById.mockImplementation(()=>{throw new Error("Database error")});
            // Act 
            const response = await request(app).delete('/movies/reviews/starwars').set('authorization', "Bearer Token").send(mockRequest);                        
            // Asset
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not process the deleteion of the review please try again later");
        })
    }) 
})