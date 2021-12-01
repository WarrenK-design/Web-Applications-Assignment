// Description:
//  Action functions perform the logic and dispatch actions to reducers 
//  By default these should be synchrnaus calls but we have thunk middleware (see store.js file) so 
//  we can implement async backend calls to our express backend. Need to define 
//  This file holds all the action functions associated with the user piece of state 

// Syntax of actions:
//  If action function makes an async call, we need to return a function from this action 
//  this will then get picked up and handled by the thunk middleware we added in store.js 
//  by default all actions should be synchronous but api calls cannot be synchronous 

/// Imports ///
// user_action_constants - These are constants defined in ../constants/userActionConstants which are used to test action.type 
// axios - Used to make http calls to the backend 
import {
  USER_LOGIN_REQUEST,USER_LOGIN_SUCCESS,USER_LOGIN_FAIL,USER_LOGOUT, // login and logout functions 
  USER_REGISTER_REQUEST,USER_REGISTER_SUCCESS,USER_REGISTER_FAIL, // regUser functions
  USER_MOVIE_LIST_UPDATE_REQUEST,USER_MOVIE_LIST_UPDATE_SUCCESS,USER_MOVIE_LIST_UPDATE_FAIL // updateMovieList
}
from '../constants/userActionConstants';
import axios from 'axios';

/// login ///
// Description:
//  This function is called when a user attempts to login 
//  it used the userLoginReducer in the file ../reducers/userReducers.js
// Inputs:
//  email    - The users email address 
//  password - The users password 
export function login(email, password) {
  // Return a async function so we can make async calls, middle ware will pick this up 
  return async (dispatch) => {
    try{
        // First initiate the request, will set loading to true
        dispatch({type:USER_LOGIN_REQUEST})
        // Set the http request configuration 
        let requestConfig = {
            method: 'post',
            url: '/user/login',
            data: {
                email: email,
                password: password}
        }
        // Send the request with axios, will return users details 
        const {data} = await axios(requestConfig);
        // Now dispatch the success action and pass the users details in the payload 
        dispatch({type:USER_LOGIN_SUCCESS,payload:data})
        // Set the data to local storage
        localStorage.setItem('userInfo',JSON.stringify(data))
    }catch(error){
        // Set the payload to the user frienly error message from the API 
        dispatch({
            type:USER_LOGIN_FAIL,
            payload:error.response.data.errormessage})
    } 
  }
}


/// logout ///
// Description:
//  This function logs out the user from the application 
//  It resets the user state and clears the users information from local storage 
export function logout() {
  // Return a async function so we can make async calls, middle ware will pick this up 
  return (dispatch) => {
    // remove the users information from localstorage 
    localStorage.removeItem('userInfo');
    // Dispatch the user logout action
    dispatch({type:USER_LOGOUT})
  }
}

/// register ///
// Description:
//  This function is to register a user 
//  It submits a post request to /user with the users 
//  email, first name, last name and password 
// Inputs:
//  email       - From the user register screen form 
//  firstName   - From the user register screen form 
//  secondName  - From the user register screen form 
//  password    - From the user register screen form 
export function regUser(email,firstName,secondName,password){
   // Return a async function so we can make async calls, middle ware will pick this up 
  return async (dispatch) => {
    try{
      // First initiate the request, will set loading to true
      dispatch({type:USER_REGISTER_REQUEST})
      // Set the http request configuration 
      let requestConfig = {
            method: 'post',
            url: '/user/',
            data: {
                email: email,
                firstName: firstName,
                secondName: secondName,
                password: password}
      }
      // Send the request with axios, will return users details 
      const {data} = await axios(requestConfig);
      // Dispatch the user register success, will set register loading false 
      dispatch({type:USER_REGISTER_SUCCESS});
      // Now dispatch the login success action and pass the users details in the payload, this will set user state 
      dispatch({type:USER_LOGIN_SUCCESS,payload:data})
      // Set the data to local storage
      localStorage.setItem('userInfo',JSON.stringify(data))
    }catch(error){
      // Set the payload to the user frienly error message from the API 
        dispatch({
            type:USER_REGISTER_FAIL,
            payload:error.response.data.errormessage})
    }
  }
}


/// updateMovieList ///
// Description:
//  This function is used to update a movie list for a user
//  this means either deleting or adding a movie to the user movie list 
// Inputs:
//  method      - Will either be DELETE (for deleting a movie) or POST (for adding a movie) 
//  movieId     - The movie to be added or deleted 
export function updateMovieList(method,movieId){
  // Return a async function so we can make async calls, middle ware will pick this up 
  // Calling a protecte route, need to get the state of current logged in user so pass get state too 
  return async (dispatch,getState) => {
    try{
      // First initiate the request, will set loading to true
      dispatch({type:USER_MOVIE_LIST_UPDATE_REQUEST})
      // Need to get the current logged in user as this is a protected route 
      let {user: {userInfo}} = getState()      


      // Set the http request configuration 
      let requestConfig = {
            method: method,
            url: '/user/mymovies',
            data: {
                movieId: movieId,
      },
       headers: {
              authorization: `Bearer ${userInfo.jwt}`
            }
    }
      // Send the request with axios, will return users details 
      const {data} = await axios(requestConfig);
      // Set the new attribute, not updated in global state here 
      userInfo.myMovies = data.myMovies;
      // Dispatch the user register success, will set register loading false 
      dispatch({type:USER_MOVIE_LIST_UPDATE_SUCCESS});
      // Now dispatch the login success action and pass the users details in the payload, this will set user state so we can access movies 
      dispatch({type:USER_LOGIN_SUCCESS,payload:userInfo})
      // Set the data to local storage
      localStorage.setItem('userInfo',JSON.stringify(userInfo))
    }catch(error){
        console.log(error)
        // Set the payload to the user frienly error message from the API 
        dispatch({
            type:USER_MOVIE_LIST_UPDATE_FAIL,
            payload:error.response.data.errormessage})
    }
  }
}
