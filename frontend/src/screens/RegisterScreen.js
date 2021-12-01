/// Description:
//  This is for a new user signing up to the application
//  The user fills in there detials using the form and this is sent to the backend 

// Imports //
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
// useNavigate - Allows you to programtically redirect, see https://reactrouter.com/docs/en/v6/api#usenavigate
// Link - Used for the link to login route 
import {useState,useEffect} from 'react';
import {useNavigate,Link } from "react-router-dom";

// Components //
// ForContainer   - Component to wrap forms in so they look the same through out application 
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
import FormContainer from "../components/Layout/FormContainer";
import LoadingSpinner from "../components/Widgets/LoadingSpinner";
import MessageAlert from "../components/Widgets/MessageAlert";

// Bootsrap //
// Form    - See https://react-bootstrap.github.io/components/forms/
// Button  - See https://react-bootstrap.github.io/components/buttons/
// Row/Col - See https://react-bootstrap.github.io/layout/grid/ 
import {Form,Button,Row,Col} from 'react-bootstrap';

// Redux //
// useDispatch - Used to dispatch actions https://react-redux.js.org/api/hooks
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
// register    - The action which will be dispatched to registr a user 
import {useDispatch,useSelector} from 'react-redux';
import {regUser} from '../actions/userActions';


/// RegisterScreen ///
// Description:
//  Holds the JSX and functionality for the Register screen 
//  this screen is for a new user signing up 
function RegisterScreen() {
  /// State ///
  // email           - Email address user will use to login 
  // password        - Password user will use to login 
  // firstName       - Users firstname 
  // secondName      - Users secondName
  // confirmPassword - Used to ensure both passwords entered match 
  // passwordMessage - If passwords dont match this is used 
  const [email, setEmail]                     = useState('');
  const [password,setPassword]                = useState('');
  const [firstName, setFirstName]             = useState('');
  const [secondName, setSecondName]           = useState('');
  const [confirmPassword,setConfirmPassword]  = useState('');
  const [errorMessage, setErrorMessage]       = useState(null);

  // navigate - It is a function that lets you naviagte programitically for redircts, used in useEffect below 
  const navigate = useNavigate();

  /// Redux ///
  // Description:
  //  Redux manages the global state, need to use that state for "user" and "userRegistration"
  // dispatch - Get reference to dispatch function from react-redux 
  const dispatch = useDispatch();
  // state here is the entire redux state, we only want a piece of it  
  // user             - Will be object with attributes of loading, error and userInfo
  // userRegistration - Attributes of loading and error related to registration process  
  const user             = useSelector((state) => state.user);
  const userRegistration = useSelector((state) => state.userRegistration);
  const {loading, error} = userRegistration;
  const {userInfo} = user;

  /// handleSubmit ///
  // Description:
  //  This function is called when the submit button "Register" button is clicked 
  //  which is associated with the onSubmit prop of the form 
  // Inputs:
  //  event - The button event, 
  function handleSubmit(event) {
    event.preventDefault();
    // Do it in the order of the form makes more sense for user, general one to start with 
    if(email ==='' && firstName ==='' && secondName ==='' && password ==='' && confirmPassword ===''){
      setErrorMessage("All fields must be filled in");
    }else if(email === ''){
      setErrorMessage("Please provide your email");
    }else if(firstName === ''){
      setErrorMessage("Please provide your first name");
    }else if(secondName === ''){
      setErrorMessage("Please provide your second name");
    }else if(password === ''){
      setErrorMessage("Please provide a password");
    }else if(password !== confirmPassword){
      setErrorMessage("Password and Confirm Password must be equal");
    }else if (password.length < 6){
      setErrorMessage("Password must be 6 characthers in length or more");
    }else{
      // Everthing is ok, dispatch the registration 
      dispatch(regUser(email,firstName,secondName,password)) 
    }
  }

  /// useEffect ///
   // Description:
  //  Using the use effect hook to see if a user is already logged in by checking the userInfo state
  //  If the userInfo state has something in then user already logged in, redirect them 
  useEffect (() => {
    // Check if userInfo has something in it 
    if(userInfo){
      // Need to redirect 
      navigate('/');
    }
  },[userInfo,navigate])

  /// JSX ///
  // Conditional rendering for the error and loading components 
  // error        -> Holds error returned from backend
  // errorMessage -> Is a for error i.e user didnt enter all details 
  // conditional rendering see  https://reactjs.org/docs/conditional-rendering.html 
  return (
    <FormContainer>
      {error && <MessageAlert variant='danger'>{error}</MessageAlert>}
      {loading && <LoadingSpinner/>}
      {errorMessage && <MessageAlert variant="danger">{errorMessage}</MessageAlert>}
      <h1 className="pt-2"style={{textAlign:'center'}}>Register</h1> 
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

        <Form.Group className="py-2" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="First Name" 
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            />
        </Form.Group>

        <Form.Group className="py-2" controlId="secondName">
          <Form.Label>Second Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Second Name" 
            value={secondName}
            onChange={(event) => setSecondName(event.target.value)}
            />
        </Form.Group>

          <Form.Group className="py-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(event) => setPassword(event.target.value)}/>
            <Form.Text>Password must be of length 6 chracthers or more</Form.Text>
        </Form.Group>

        <Form.Group className="py-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(event) => { setConfirmPassword(event.target.value) }}/>
          <Form.Text>Must match the password in the Password field</Form.Text>
        </Form.Group>

        <Row> 
          <Col className='text-center py-3'>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col className='text-center pb-2'>
          Already Have an Account?  
            <Link className='px-1' to='/login'>Sign In</Link>
        </Col>
      </Row>
    </FormContainer>
    );
}

export default RegisterScreen;