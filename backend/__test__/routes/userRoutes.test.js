//const myMockFn = jest.fn(cb => cb(true));
//jest.mock('../../middleware/authMiddleware.js',myMockFn);

/// Imports ///
// request     - From the supertest mosudle, used to send http request in testing environment 
// express     - The backend API framework 
// userRouter  - The routes which we are testing  
import request from 'supertest';
import {jest} from '@jest/globals'
import app from '../../app.js';
import User from '../../models/userModel.js'
import * as gen from '../../utils/generateJWT.js';
import jwt from 'jsonwebtoken';


/// Test 1 ///
// Desription:
//  This test is for testing the creation of a new user within the system 
// Route:
//  POST /user
describe("POST /user", () => {
    // request // 
    let mockRequest;
    let mockJWTReturn = "MockJWT";

    // When firstName, secondName, emaila and password are present 
    describe("Values for email, firstName, secondName and password sent", () =>{
        // Create a request object that is used in each test 
        beforeEach(async () => {
            mockRequest = {firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",password:"abc123ABC"};
        });

        // Should succefully create the user respond with status code 200 
        test('Should return 201, user created succsefully', async () =>{
            // Arrange 
            gen.genJWT = jest.fn();
            gen.genJWT.mockReturnValue(mockJWTReturn)
            User.findOne = jest.fn().mockResolvedValue('');
            User.create  = jest.fn().mockResolvedValue({
                id:"1",
                firstName:mockRequest.firstName,
                secondName:mockRequest.secondName,
                email:mockRequest.email,
                isAdmin:false,
            }) 
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(201);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockRequest.firstName);
            expect(response.body.secondName).toBe(mockRequest.secondName);
            expect(response.body.email).toBe(mockRequest.email);
            expect(response.body.isAdmin).toBe(false);
            expect(response.body.jwt).toBe(mockJWTReturn);
        });

        // test user already in system 
        test('Should return 400, bad data user already exists in system',async () => {
            // Arrange
            User.findOne = jest.fn().mockResolvedValue({firstName:"ExistsingJohn",secondName:"Doe",email:"JohnDoe123@gmail.com"});
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.type).toBe('application/json')
            expect(response.body.errormessage).toBe("A user with this email already exists, try a different email")
        })
    })

    // When data is missing from the request 
    describe("Data missing from the request", () =>{ 
       
        // No data sent
        test('Should return 400, no data sent', async () =>{
            //Arrange 
            mockRequest = {}
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A first name, second name, email and password is required to register a user")
        })

        // No email sent 
        test('Should return 400, no email sent in request', async () =>{
            //Arrange 
            mockRequest = {firstName:"John",secondName:"Doe",password:"abc123ABC"};
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A first name, second name, email and password is required to register a user")
        })

        // No first name sent 
        test('Should return 400, no first name sent in request', async () =>{
            //Arrange 
            mockRequest = {secondName:"Doe",email:"JohnDoe123@gmail.com",password:"abc123ABC"};
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A first name, second name, email and password is required to register a user")
        })

        // No secondName sent 
        test('Should return 400, no second name sent in request', async () =>{
            //Arrange 
            mockRequest = {firstName:"John",email:"JohnDoe123@gmail.com",password:"abc123ABC"};
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A first name, second name, email and password is required to register a user")
        })

        // No password sent 
        test('Should return 400, no password sent in request', async () =>{
            //Arrange 
            mockRequest = {firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com"};
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A first name, second name, email and password is required to register a user")
        })
    })

    // When data is missing from the request 
    describe("Test when data sent but user could not be created due to internal server error", () =>{ 
        // Create a request object that is used in each test 
        beforeEach(async () => {
            mockRequest = {firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",password:"abc123ABC"};
        });

        // Corrcet data sent but user not created  
        test('Should return 500, correct data sent mongo executed create command but no created user returned', async () =>{
            // Arrange
            User.findOne = jest.fn().mockResolvedValue('');
            User.create  = jest.fn().mockResolvedValue('');
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("User could not be registered at this time, sorry try again later")
        })

        // Corrcet data sent but mongo findOne returns error  
        test('Should return 500, correct data sent mongo database threw an error in its function', async () =>{
            // Arrange
            User.findOne = jest.fn().mockImplementation(() => {
                throw new Error("Error with database finding user");
            });
            // Act 
            const response = await request(app).post('/user').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("User could not be registered at this time, sorry try again later")
        })
    })
})


/// Test 2 ///
// Desription:
//  This test is for testing if a user can login 
// Route:
//  POST /user
describe("POST /user/login", () => {
        
    let mockJWTReturn = "MockJWT";

    // Values sent for email and password 
    describe("Values for email and password sent", () =>{


        let mockRequest;
        // Create a request object that is used in each test 
        beforeEach(async () => {
            mockRequest = {email:"JohnDoe123@gmail.com",password:"abc123ABC"};
        });
        
        // User succesfully logs in 
        test("Should return 200, login successful",async () => {
            // Arrange
            let mockUser = {id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:["StarWars"]}
            User.findOne = jest.fn().mockImplementation(() => { return mockUser});
            mockUser.populate = jest.fn().mockImplementation(() => {return mockUser})
            mockUser.validatePassword = jest.fn().mockReturnValue(true);
            gen.genJWT = jest.fn();
            gen.genJWT.mockReturnValue(mockJWTReturn)
            // Act 
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockUser.firstName);
            expect(response.body.secondName).toBe(mockUser.secondName);
            expect(response.body.email).toBe(mockUser.email);
            expect(response.body.isAdmin).toBe(false);
            expect(response.body.myMovies).toStrictEqual(mockUser.myMovies);
            expect(response.body.jwt).toBe(mockJWTReturn);
        })
        
        // No user not found related to this email 
        test('Should return 404, no user found for this email', async () =>{
            // Arrange 
            let emptyUser = {}
            User.findOne = jest.fn().mockImplementation(() => { return emptyUser});
            emptyUser.populate = jest.fn().mockImplementation(() => {return null})
            // Act
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(404);
            expect(response.body.errormessage).toBe("No account linked with this email, please try again")
        })

        // User found relating to this email but wrong password 
        test('Should return 401, password incorrect unauthorised', async () =>{
            // Arrange
            let mockUser = {id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:["StarWars"]}
            User.findOne = jest.fn().mockImplementation(() => { return mockUser});
            mockUser.populate = jest.fn().mockImplementation(() => {return mockUser})
            mockUser.validatePassword = jest.fn().mockReturnValue(false);
            // Act
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(401);
            expect(response.body.errormessage).toBe("Invalid password, please try again");
        })

    })

    // Missing data tests 
    describe("Missing data sent",() =>{

        let mockRequest;
        beforeEach(async () => {
            mockRequest = {email:"JohnDoe123@gmail.com",password:"abc123ABC"};
        });
        // No data sent 
        test('Should return 400, no data sent', async () =>{
            //Arrange 
            let mockRequest = {}
            // Act 
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A email and password is required to log a user in");
        })

        // Email not sent 
        test('Should return 400, missing email', async() => {
            //Arrange 
            let mockRequest = {password:"ABC123abc"}
            // Act 
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A email and password is required to log a user in");
        })

        // Password not sent 
        test('Should return 400, missing password',async() => {
             //Arrange 
            let mockRequest = {email:"JohnDoe@123.com"}
            // Act 
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("A email and password is required to log a user in");
        
        })
    })

    describe("Database error throws error",() =>{
        let mockRequest;
        beforeEach(async () => {
            mockRequest = {email:"JohnDoe123@gmail.com",password:"abc123ABC"};
        });
        // Database throws an error should retun back 500 internal server error
        test('Should return 500, database threw error',async () =>{
            // Arrange 
            let  mockRequest = {email:"JohnDoe123@gmail.com",password:"abc123ABC"};
            User.findOne = jest.fn().mockImplementation(() => {throw new Error("Datbase error")});
            // Act
            const response = await request(app).post('/user/login').send(mockRequest);
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not authenticate user at this time, sorry try again later");
        })
    })
})

/// Test 3 ///
// Desription:
//  This test is for updating a users profile 
// Route:
//  PUT /user/profile
describe("PUT /user/profile", () => { 


    describe("Correctly formatted data", () => {
        let mockUser;

        // beforeEach ///
        // Here the auth middleware is mocked as we dont care about the authorisation
        // the mockUser will be tested if it is updated in each test but reset before each test 
        beforeEach(async () => {
            jwt.verify = jest.fn();
            jwt.verify.mockReturnValue("decodedToken");
            mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:"StarWars"}
            User.findById = jest.fn().mockImplementation(() => { return mockUser});
            mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
            mockUser.save = jest.fn();
            mockUser.populate = jest.fn().mockImplementation(() => {return mockUser});
        });


        // User updates their firstName, secondName, email and password
        test("Should return 200, all attributes updated",async () =>{
            // Arrange
            let mockRequest = {firstName:"newFirstName",secondName:"newSecondName",email:"newEmail@test.com"}
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockRequest.firstName);
            expect(response.body.secondName).toBe(mockRequest.secondName);
            expect(response.body.email).toBe(mockRequest.email);
        })

        // USer only updates email
        test("Should return 200, email updated",async () =>{
             // Arrange
            let mockRequest = {email:"newEmail@test.com"}
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockUser.firstName);
            expect(response.body.secondName).toBe(mockUser.secondName);
            expect(response.body.email).toBe(mockRequest.email);
        })
        
        // User only updates firstName
        test("Should return 200, first name updated",async () =>{
            // Arrange
            let mockRequest = {firstName:"newFirstName"}
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockRequest.firstName);
            expect(response.body.secondName).toBe(mockUser.secondName);
            expect(response.body.email).toBe(mockUser.email);
        })

        // User only updates secondName
        test("Should return 200, second name updated",async () =>{
            // Arrange
            let mockRequest = {secondName:"newSecondName"}
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockUser.firstName);
            expect(response.body.secondName).toBe(mockRequest.secondName);
            expect(response.body.email).toBe(mockUser.email);
        })

        // User only updates password 
        test("Should return 204, password updated",async () =>{
            // Arrange
            let mockRequest = {password:"newPassword"}
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);
            // Assert 
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json')
            expect(response.body.firstName).toBe(mockUser.firstName);
            expect(response.body.secondName).toBe(mockUser.secondName);
            expect(response.body.email).toBe(mockUser.email);

        })
    })

    // Bad data sent from the client 
    describe("Incorrect data sent from the client", () => {
        let mockUser;

        // beforeEach ///
        // Here the auth middleware is mocked as we dont care about the authorisation
        // the mockUser will be tested if it is updated in each test but reset before each test 
        beforeEach(async () => {
            jwt.verify = jest.fn();
            jwt.verify.mockReturnValue("decodedToken");
            mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:"StarWars"}
            User.findById = jest.fn().mockReturnValueOnce(mockUser);
            mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
            mockUser.save = jest.fn();
            mockUser.populate = jest.fn().mockReturnValueOnce(mockUser);
        });

        // User cannot be found in the database 
        test('Should return 404, user cannot be found',async () => {
            // Arrange 
            let mockRequest = {firstName:"newFirstName",secondName:"newSecondName",email:"newEmail@test.com"}
            User.findById.mockReturnValueOnce('');
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(404);
            expect(response.body.errormessage).toBe("No reference to the user in the system");
        })

        // User setting email to an email which is already in the database
        test('Should return 409, conflict a user with this email already exists',async () => {
            // Arrange 
            let mockRequest = {firstName:"newFirstName",secondName:"newSecondName",email:"newEmail@test.com"}
            User.findById.mockReturnValueOnce(mockUser);
            mockUser.save.mockImplementation(() => {
                let e = new Error("MongoServerError");
                e.name = "MongoServerError";
                e.code = 11000;
                throw e;
            })
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(409);
            expect(response.body.errormessage).toBe("A user with this email already exists within the system");
        })        
        // Server error from Mongo 
        test('Shoudl return 500, internal server error',async () => {
            // Arrange 
            let mockRequest = {firstName:"newFirstName",secondName:"newSecondName",email:"newEmail@test.com"}
            User.findById.mockReturnValueOnce(mockUser);
            mockUser.save.mockImplementation(() => {
                let e = new Error("MockError");
            })
            // Act 
            const response = await request(app).put('/user/profile/').set('authorization', "Bearer Token").set('Content-Type', 'application/json').set('Content-Type', 'application/json').send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not update users profile at this time, sorry try again later");
        })                

    })

/// Test 4 ///
// Desription:
//  This test is for getting a users profile Image
// Route:
//  GET /user/profileImage
describe("GET /user/profileImage", () => {  
    let mockUser;

    // beforeEach ///
    // Here the auth middleware is mocked as we dont care about the authorisation
    // the mockUser will be tested if it is updated in each test but reset before each test 
    beforeEach(async () => {
        // mockUser 
        mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:"StarWars"}
        // Mock the auth calls 
        jwt.verify = jest.fn();
        jwt.verify.mockReturnValue("decodedToken");
        User.findById = jest.fn().mockReturnValueOnce(mockUser);
        mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
    });
   
    describe("Correctly formatted data", () =>{
        // User has not changed there profile picture, retrieve default on 
        test("Should return 200, default user profile picture returned", async() =>{
            // Arrange
            User.findById.mockReturnValue(mockUser);
            mockUser.exec = jest.fn().mockReturnValue(mockUser);
            // Act 
            const response = await request(app).get('/user/profileImage/').set('authorization', "Bearer Token");            
            // Assert
            expect(response.statusCode).toBe(200)
            expect(response.type).toBe('image/jpeg')
        })

        // USer has changed profile picture get custom profile picture 
        test("Should return 200, custom user profile picture returned", async() =>{
            // Arrange
            /// Using the default here as the "custom", it will enter different branh
            mockUser.profileImage="default_profile_image.jpg";
            User.findById.mockReturnValue(mockUser);
            mockUser.exec = jest.fn().mockReturnValue(mockUser);
            // Act 
            const response = await request(app).get('/user/profileImage/').set('authorization', "Bearer Token");            
            // Assert
            expect(response.statusCode).toBe(200)
            expect(response.type).toBe('image/jpeg')
        })
    })

    describe("Internal server error", () =>{
        let mockUser;

        // beforeEach ///
        // Here the auth middleware is mocked as we dont care about the authorisation
        // the mockUser will be tested if it is updated in each test but reset before each test 
        beforeEach(async () => {
            // mockUser 
            mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:"StarWars"}
            // Mock the auth calls 
            jwt.verify = jest.fn();
            jwt.verify.mockReturnValue("decodedToken");
            User.findById = jest.fn().mockReturnValueOnce(mockUser);
            mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
        });
           
        // USer has changed profile picture get custom profile picture 
        test("Should return 500, internal server error catch", async() =>{
            // Arrange
            User.findById.mockImplementation(() => {throw new Error()});
            //mockUser.exec = jest.fn().mockReturnValue(mockUser);
            // Act 
            const response = await request(app).get('/user/profileImage/').set('authorization', "Bearer Token");            
            // Assert
            expect(response.statusCode).toBe(500)
            expect(response.body.errormessage).toBe("Could not retrieve the users profile image at this time")
        });
    })

/// Test 5 ///
// Desription:
//  These tests are for adding to a users MyMovie list 
// Route:
//  POST /user/mymovies
describe("POST /user/mymovies", () => {  
    let mockUser;
    // beforeEach ///
    // Here the auth middleware is mocked as we dont care about the authorisation
    // the mockUser will be tested if it is updated in each test but reset before each test 
    beforeEach(async () => {
        // mockUser 
        mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:["StarWars"]}
        // Mock the auth calls 
        jwt.verify = jest.fn();
        jwt.verify.mockReturnValue("decodedToken");
        User.findById = jest.fn().mockReturnValueOnce(mockUser);
        mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
    });

    describe("Correct data sent to mymovies", ()=>{
        // User has sent movie and added to list 
        test("Should return 200, movie added to myMovies list", async () => {
            // Arrange
            let mockRequest = {movieId:"1"};
            mockUser.myMovies=[{movie:"2"},{movie:"3"},{movie:"4"}];
            User.findById.mockReturnValue(mockUser);
            mockUser.myMovies.push = jest.fn();
            mockUser.save = jest.fn().mockResolvedValue(mockUser);
            mockUser.populate = jest.fn().mockImplementation(() =>{
                let newMovies =  mockUser.myMovies.concat([{movie:mockRequest.movieId}]);
                mockUser.myMovies = newMovies;
                return mockUser;
            })
            // Act 
            const response = await request(app).post('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.myMovies).toEqual(expect.arrayContaining([{"movie":mockRequest.movieId}]))
        })

        // Correct data semt but movie already in list 
          test("Should return 409, conflict movie already in myMovie list", async () => {
            // Arrange
            let mockRequest = {movieId:"1"};
            mockUser.myMovies=[{movie:"1"},{movie:"2"}];
            User.findById.mockReturnValue(mockUser);
            // Act 
            const response = await request(app).post('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert 
            expect(response.statusCode).toBe(409);
            expect(response.body.errormessage).toBe("This movie already exists within your movie collection")
          });
    })

    describe("Incorrect data or server error", ()=>{
        // No movieId sent 
        test("Should return 400, no movieId sent", async() =>{
            // Arrange
            let mockRequest = {}
            // Act 
            const response = await request(app).post('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);                            
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure that a movie has been selected to be added")
        })
        // Internal server error 
        test("Should return 500, internal server error", async() =>{
            // Arrange
            let mockRequest = {movieId:"1"};
            User.findById.mockImplementation(() => {throw new Error("Internal error")});
            // Act
            const response = await request(app).post('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);                            
            // Assert
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not add this movie to your movies at this time please try again later")
        })
     })
})

/// Test 6 ///
// Desription:
//  These tests are for adding to a users MyMovie list 
// Route:
//  POST /user/mymovies
describe("DELETE /user/mymovies", () => {  
    let mockUser;
    // beforeEach ///
    // Here the auth middleware is mocked as we dont care about the authorisation
    // the mockUser will be tested if it is updated in each test but reset before each test 
    beforeEach(async () => {
        // mockUser 
        mockUser = {_id:1,firstName:"John",secondName:"Doe",email:"JohnDoe123@gmail.com",isAdmin:false,myMovies:["StarWars"]}
        // Mock the auth calls 
        jwt.verify = jest.fn();
        jwt.verify.mockReturnValue("decodedToken");
        User.findById = jest.fn().mockReturnValueOnce(mockUser);
        mockUser.select = jest.fn().mockImplementation(() => {return mockUser})
    });

    describe("Correct data sent to delete a movie", ()=>{

        // Movie succesfully deleted 
        test("Should return 200, movie succfully deleted from MyMovies", async() =>{
            // Arrange
            let mockRequest = {movieId:"1"};
            mockUser.myMovies=[{movie:"1",_id:"1"},{movie:"2",_id:"2"},{movie:"3",_id:"3"}];
            User.findById.mockReturnValue(mockUser);
            mockUser.myMovies.pull = jest.fn()
            mockUser.myMovies.pull.mockImplementation(() =>{
                mockUser.myMovies.splice(0,1);
                return mockUser;
            })
            mockUser.save = jest.fn().mockResolvedValue(mockUser);
            mockUser.populate = jest.fn().mockImplementation(() =>{return mockUser});
            // Act 
            const response = await request(app).delete('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.body.myMovies).not.toEqual(expect.arrayContaining([{"movie":mockRequest.movieId}]))
        })

    })

    describe("Incorrect data sent", () =>{
        // No mive assocatited with the ID
        test("Should return 404, no movie associated with this movie ID in users myMovie list", async () =>{
            // Arrange
            let mockRequest = {movieId:"100"};
            mockUser.myMovies=[{movie:"1",_id:"1"},{movie:"2",_id:"2"},{movie:"3",_id:"3"}];
            User.findById.mockReturnValue(mockUser);
            // Act
            const response = await request(app).delete('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(404);
            expect(response.body.errormessage).toBe("Please ensure the selected movie to be deleted is in your movie section");
        })
        // Bad data no movieID sent 
        test("Should return 400, no movie ID sent in the request", async () =>{
            // Arrange
            let mockRequest = {};
            // Act 
            const response = await request(app).delete('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errormessage).toBe("Please check to ensure a movie has been selected to be deleted");
        })
        // Bad data no movieID sent 
        test("Should return 500, internal server error case", async () =>{        
            // Arrange
            let mockRequest = {movieId:1}
            User.findById.mockImplementation(() =>{throw new Error()});
            // Act 
            const response = await request(app).delete('/user/mymovies/').set('authorization', "Bearer Token").send(mockRequest);            
            // Assert 
            expect(response.statusCode).toBe(500);
            expect(response.body.errormessage).toBe("Could not delete this movie from your movies at this time please try again later");
        })

    })
})
})

})
