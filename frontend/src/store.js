/// Description:
//  Redux is used to manage the global state of this project instead of passing state around components 
//  This global state is stored within a "store" which is defined in this file 
//  There are three main components that make up the flow of redux:
//      Reducer - These are 

/// Imports ///
// createStore     - This is used to create the global redux store which stores global state in our application 
// combineReducers - Bit easier to have one or two reducers, then we can just combine them and add to the store 
// applyMiddleware - Allows to add middleware to redux, middleware of thunk is used 
// thunk - Allows us to call async when dispathcing actions in redux, be default async code not allowd we need async code when calling database -> https://redux.js.org/usage/writing-logic-thunks#async-logic-and-side-effects  
// composeWithDevTools - Used to enable the dev tool chrome extension to to see the current store, install here makes life easier https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

/// Reducers /// 
// Description:
//  Reducers can be found in the ../reducers/ directory, they update the state based on values form action functions 
//  if there are multiple reducers which control different state need to combine them using combineReducers function 
// userReducers - Contain reducers for the user global state 
//  userLoginReducer    - Reducer for setting the state of logged in users information 
//  userRegisterReducer - Reducer used in handling registertraion of the user 
import { userLoginReducer, userRegisterReducer } from './reducers/userReducers'; 
const reducer = combineReducers({
    user: userLoginReducer,
    userRegistration: userRegisterReducer
})

/// Initial State -> Persisting between sessions ///
// We can set initial values for the state, for example not requiring a user to login each time they enter the app 
// Need to first check if there is a value in the localStorage to set the state to, if there is set it, if not will be empty 
// userLocalStaorage - This gets the users information from local staorage and sees if it is there 
const userLocalStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

// startingState - define values which are in the state when the application starts up 
// user - Setting the userInfo part of the user state to the users information 
const startingState = {
    user: {userInfo: userLocalStorage}
};

// store - This is our actual store, we pass in the reducers, startingState and then any middleware 
//         the middleware thunk is used to call async code in reducers, composeWeithDevtools is used 
//         to enable the redux dev tools browser extension which is useful for developing 
const store = createStore(reducer,startingState,composeWithDevTools(applyMiddleware(thunk)))

// Need to then export the store 
export default store;