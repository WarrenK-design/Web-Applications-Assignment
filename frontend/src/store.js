/// Description:
//  Redux is used to manage the global state of this project instead of passing state around components 
//  This global state is stored within a "store" which is defined in this file 
//  If you want to change the store you need to create an action 
//  The action then needs to be dispatched 

/// Imports ///
// createStore     - This is used to create the global redux store which stores global state in our application 
// combineReducers - Bit easier to have one or two reducers, then we can just combine them and add to the store 
// applyMiddleware - Allows to add middleware to redux, middleware of thunk is used 
// thunk - Allows us to call async when dispathcing actions in redux, need async code when calling database  
// composeWithDevTools - Used to enable the dev tool chrome extension to to see the current store, install here makes life easier https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

// Reducers - Need to combine into a single reducer if stored in seperate files 
const reducer = combineReducers({})

// startingState - efine values which are in the state when the application starts up 
const startingState = {}

// store - This is our actual store, we pass in the reducers, startingState and then any middleware 
//         the middleware thunk is used to call async code in reducers, composeWeithDevtools is used 
//         to enable the redux dev tools browser extension which is useful for developing 
const store = createStore(reducer,startingState,composeWithDevTools(applyMiddleware(thunk)))

// Need to then export the store 
export default store;