// Description:
//  This file holds the constants for action types associated the redux state managment 
//  These constants are used in the reducers to specify what actions to take 
//  Its easier to have them defined as constants in one place 

// Login action constants 
export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL    = "USER_LOGIN_FAIL";   

// Logoout action constants 
export const USER_LOGOUT = "USER_LOGOUT";

// Register action constants 
export const USER_REGISTER_REQUEST = "USER_REGISTER_REQUEST";
export const USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS";
export const USER_REGISTER_FAIL    = "USER_REGISTER_FAIL";


// User movie list constants 
export const USER_MOVIE_LIST_UPDATE_REQUEST = "USER_MOVIE_LIST_UPDATE_REQUEST";
export const USER_MOVIE_LIST_UPDATE_SUCCESS = "USER_MOVIE_LIST_UPDATE_SUCCESS";
export const USER_MOVIE_LIST_UPDATE_FAIL   = "USER_MOVIE_LIST_UPDATE_ERROR";

