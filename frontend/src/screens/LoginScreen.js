/// Description:
//  Screen displays a login form for the user to fill out and sends request 
//  to the backend 

// Imports //
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
// useNavigate - Allows you to programtically redirect, see https://reactrouter.com/docs/en/v6/api#usenavigate
// Link - Used for the link to the register route 
import {useState,useEffect} from 'react';
import { useNavigate,Link } from "react-router-dom";


// Bootsrap //
// Form    - See https://react-bootstrap.github.io/components/forms/
// Button  - See https://react-bootstrap.github.io/components/buttons/
// Row/Col - See https://react-bootstrap.github.io/layout/grid/ 
import {Form,Button,Row,Col} from 'react-bootstrap';


// Components //
// ForContainer   - Component to wrap forms in so they look the same through out application 
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
import FormContainer from "../components/Layout/FormContainer";
import LoadingSpinner from "../components/Widgets/LoadingSpinner";
import MessageAlert from "../components/Widgets/MessageAlert";

// Redux //
// useDispatch - Used to dispatch actions https://react-redux.js.org/api/hooks
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
// login       - The login user action to send request to backend and update the state 
import {useDispatch,useSelector} from 'react-redux';
import {login} from '../actions/userActions';

/// LoginScreen ///
// Description:
//  Used for the login screen page, it uses the bootstrap classes for forms 
//  User enters email and password, stroed in function level state,
//  On submission of form request is sent to the backend to login the user 
// Links:
//  Look at examples on reactbootstrap https://react-bootstrap.github.io/components/forms/
function LoginScreen() {
  // State //
  // email    - Holds value of the email form 
  // password - Holds value of the password form 
  const [email,setEmail]       = useState('');
  const [password,setPassword] = useState('');

  // navigate - It is a function that lets you naviagte programitically for redircts, used in useEffect below 
  const navigate = useNavigate();

  /// Redux ///
  // Description:
  //  Redux manages the global state, need to use that state for "user" in this component 
  // dispatch - Get reference to dispatch function from react-redux 
  const dispatch = useDispatch();
  // Get the user state using useSelector
  // state here is the entire redux state, we only want the user state 
  // user - will be object with attributes of loading, error and userInfo
  const user = useSelector((state) => state.user)
  const {loading, error, userInfo} = user;


  /// handleSubmit ///
  // Description:
  //  This function is called when the submit button "login" button is clicked 
  //  which is associated with the onSubmit prop of the form 
  // Inputs:
  //  event - The button event, 
  function handleSubmit(event) {
    // By default on submit there will be page refresh, dont want this 
    event.preventDefault();
    // Dispatch the login action passing the email and password in 
    dispatch(login(email,password));
  }



  /// useEffect ///
  // Description:
  //  Using the use effect hook to see if a user is already logged in by checking the userInfo state
  //  If the userInfo state has something in then user already logged in 
  useEffect (() => {
    // Check if userInfo has something in it 
    if(userInfo){
      // Need to redirect 
      navigate('/');
    }
  },[userInfo,navigate])


  /// return ///
  // Description:
  //  Returns the form for user login but also displays error message recived from API if something is wrong 
  //  This uses conditional rendering and inline conditional rendering, see here for more info https://reactjs.org/docs/conditional-rendering.html 
  return (
    <FormContainer>
      {error && <MessageAlert variant='danger'>{error}</MessageAlert>}
      {loading && <LoadingSpinner/>}
      <h1 className="pt-2"style={{textAlign:'center'}}>Login</h1> 
      <Form onSubmit={handleSubmit}>
        <Form.Group className="py-2" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            />
        </Form.Group>

        <Form.Group className="py-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(event) => setPassword(event.target.value)}/>
        </Form.Group>
        <Row> 
          <Col className='text-center py-3'>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col className='text-center'>
          New Member's can Regiser  
            <Link className='px-1' to='/register'>Here</Link>
        </Col>
      </Row>

    </FormContainer>
    );
}

export default LoginScreen;