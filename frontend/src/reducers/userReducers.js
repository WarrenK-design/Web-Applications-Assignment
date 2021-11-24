// Description:
//  This file holds all the redux reducers associated with the logged in user global state 
//  Each reducer accepts two things:
//      state  - Current/Initial state 
//      action - Tells the reducer how to update the state with the associated type, the payload contains what the state is to be updated to 
//  Depending upon the action type, the state will be updated to some value, 
//  ***state should always be returened from reducer***

/// Imports ///
// user_action_constants - These are constants defined in ../constants/userActionConstants which are used to test action.type 
import {
    USER_LOGIN_REQUEST,USER_LOGIN_SUCCESS,USER_LOGIN_FAIL // -> used in userLoginReducer

}
from '../constants/userActionConstants';


// userLoginReducer //
// Description:
//  This is the reducer for updating the user global state when a user 
//  attempts to login through the login screen 
export function userLoginReducer (state ={}, action) {
    // Check the action type
    switch (action.type) {
        // User has made a request to login 
        case USER_LOGIN_REQUEST:
            // Set loading true -> request being carried out 
            return {loading: true} 
        // User has succefully logged in 
        case USER_LOGIN_SUCCESS:
            // We have the users details now 
            return {loading: false, userInfo: action.payload}
        // User login has failed 
        case USER_LOGIN_FAIL:
            // set the error message which will be in patload
            return {loading:false, error: action.payload}
        // For the default just return the unmodified state, is this is entered then action hasnt been dipatched correctly
        default:
            return state;
        } 
}