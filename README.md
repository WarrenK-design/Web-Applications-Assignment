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

1. ***index.js*** - Starting point for the application, contains instantiation of express app
2. ***routes*** - Each sub route has its own route file which uses the Express router to add routes to the express app
3. ***controllers*** - The controllers are called by the routes and are passed the req, res and next objects. They call database services and return messages to the client. 
4. ***middleware*** - Contains the middleware for veryfying a JWT token for a protected route and the error middleware for sending back any other response other than a 200 code. 
5. ***database*** - This directory contains the functionality to connect to the database through Mongoose. It also contains the data to seed the database with to get the application running.
6. ***models*** - These are the mongoose data object models which map to collections in the database and provide the schema for the collections. 
7. ***utils*** - A utilitys folder, only one utility for generating a JWT but created more can be added if required.

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

