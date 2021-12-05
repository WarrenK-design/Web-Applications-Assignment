# Movie Reviews
This application is a full stack MERN application which allows users to search a variety of movies. 
Users can signup to create a profile uploading a profile picture and adding movies to their "MyMovies" section. 
Users who are logged in can also write reviews for movies which can be viewed by other users. 
Any user can search the website and view reviews but a user must sign up to access the profile features, the MyMovie features and write reviews. 

## Directory Structure 
There are two main directories within this repository.
### Backend
This holds the express REST API which is used to communicate with the database.
A brief summary of each of the directories/files is shown below. 

1. ***app.js*** - Contains the express app instantition and adds middleware to the application.
2. ***server.js*** - Imports the Express application from *app.js* and starts the server listening on a port.
3. ***routes*** - Each sub route has its own route file which uses the Express router to add routes to the express app
4. ***controllers*** - The controllers are called by the routes and are passed the req, res and next objects. They call database services and return messages to the client. 
5. ***middleware*** - Contains the middleware for veryfying a JWT token for a protected route and the error middleware for sending back any other response other than a 200 code. 
6. ***database*** - This directory contains the functionality to connect to the database through Mongoose. It also contains the data to seed the database with to get the application running.
7. ***models*** - These are the mongoose data object models which map to collections in the database and provide the schema for the collections. 
8. ***utils*** - A utilitys folder, only one utility for generating a JWT but created more can be added if required.

If new routes are to be added it should follow the structure in the steps below. 

1. ***Create Route File*** - Create a route file in the routes directory and export the router. 
2. ***Add routes to app*** - Import the router in the *index.js* file and use it for a sub route. 
3. ***Create Controller File*** - Create a file in the *controllers* directory associated with this new route. The controller will contain a function per route which handles the request and response. 

### Frontend 
This holds the react front end project which communicates with the backend. There are two main sub directorys under the ***frontend*** directory. 

1. ***public*** - This contains the index.html file which is updated by the react application. 
2. ***src*** - This contains all the reacts components, redux store and tests associated with the react project. 

There is a structure for the react components in the subdirectories. 

1. ***screens*** - These are containers which use smaller components. They are linked to a specific route on the frontend which is specified using the React Router Dom package in the *index.js* file under the *src* directory. For example the *LoginScreen* compoenent is rendered when at the frontend url */login*. 
2. ***components*** - These are smaller compoenets which are used within the screens. These provide specific functionality and are tried to be designed to be as reusable as possible. The functionality within these components could all be placed within the *Screen* components but breaking up the components into smaller components makes it more manageable and easier to reuse components in different screens. For example the ***HomeScreen*** uses the ***MovieCard*** component to display the movies. The ***ProfileScreen*** has a MyMovies section containing the users favourite movies, the ***MovieCard*** component is reused to display the users favourite movies. 

# Running Application 
There is some configuration before the application can be run. The frontend and backend need to be running at the same time, open two terminals and run one component in each.

## Node Modules
The *Node Modules* directory is not included, the package.json file can be used to install the node modules. 

For the frontend execute the following command. 
```
cd frontend
npm install
```
For the backend execute the following commands. 
```
cd backend
npm install
```

## Database 
There should be a MongoDB instance running on your local machine on port ```27017```. The connection URI is located in ```backend\.env``` if this needs to be changed. 

Execute the following commands to set up the database. 

```
cd backend
npm run seedData
```
A database named ```WebApplicationsProject``` has been created with two collections ```users``` and ```movies```. Data has been seeded to these collections using the data in ```backend\database\data```.  

***IMPORTANT*** Running ```npm run seedData``` again will reset any data in the database including newly created profiles, MyMovies or any profile changes.

## Backend 
It assumes that ```5000``` is free to run the API on. The backend application can be run in two modes, *development* or *production*.

### Development mode 
This mode returns stack traces and a user friendly message with the HTTP response which can be useful for debugging. In the ```backend/.env``` file change the ```NODE_ENV=development```. 

Two scripts can then be used to run the server. The first uses ```nodemon``` which will restart the server if a change is made to any of the files. To run the server in this mode execute the following. 
```
cd backend
npm run dev
```
The second does not restart the server if a change is made and does not use ```nodemon``` to run the server. To run using this script execute.

```
cd backend 
npm start
```

### Production Mode 
This version does not return a stack trace message, only a user friendly message as a stack trace should not be present in production. 

In the ```backend/.env``` file change the ```NODE_ENV=production```. To run the server using the following command. 
```
cd backend 
npm start
```

## Frontend
The frontend assumes that port ```3000``` is free on the machine. 
The frontend calls the backend for data using URL set in the environment variable ```REACT_APP_API_URL``` in the file ```frontend\.env```. This is set to the URL of the backend on port 5000 ```REACT_APP_API_URL=http://localhost:5000```. 
The backend has CORS enabled and should accept request from the frontend. 

To run the frontend execute the following commands. 
```
cd frontend
npm run start
```

A web browser should open the home page of the application showing movies fetched from the backend API. 