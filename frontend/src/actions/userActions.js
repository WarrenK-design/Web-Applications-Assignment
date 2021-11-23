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
// axios - Used to make http calls to the backend 
// user_action_constants - These are constants defined in ../constants/userActionConstants which are used to test action.type 
import {USER_LOGIN_REQUEST,USER_LOGIN_SUCCESS,USER_LOGIN_FAIL}
from '../constants/userActionConstants';

/// login ///
// Description:
//  This function is called when a user attempts to login 
//  it used the userLoginReducer in the file ../reducers/userReducers.js
// Inputs:
//  email    - The users email address 
//  password - The users password 
function login(email, password) {
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
        localStorage.setItem('user',JSON.stringify(data))
    }catch(error){
        // Set the payload to the user frienly error message from the API 
        dispatch({
            type:USER_LOGIN_FAIL,
            payload:error.response.data.errormessage})
    } 
  }
}
