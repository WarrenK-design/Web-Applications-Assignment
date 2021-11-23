import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Redux //
// Redux is used to manage global state, see the store.js for the redux store implmentation 
// Provider - Used to tell react that we are using redux by passing global store to it 
import {Provider} from 'react-redux';
import store from './store';


/// Render ///
// Render the App component to the DOM 
// Wrapped in Provder so we can use Redux as our global store 
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
