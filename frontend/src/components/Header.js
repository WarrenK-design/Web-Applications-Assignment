/// Description:
//  This component is the header which appears at the top of every page 

// Imports //
// Link - Want to use bootstraps Nav.Link component, but need it to behave like a Link react-router-dom component
//        by default it behaves like a ahref which will cause a rerender of components in react 
import {Link} from 'react-router-dom';

// Bootstrap //
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap';

// Redux //
// Want to show the user is logged in, need the user state from redux to do this 
// useDispatch - Used to dispatch actions https://react-redux.js.org/api/hooks
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
// logout - Function to use for the logout button 
import {useDispatch,useSelector} from 'react-redux';
import {logout} from '../actions/userActions';

/// Header ///
// Header is displayed on every page, 
// Holds the navigation bar along with the search bar 
function Header() {
  /// Redux ///
  // Description:
  //  Redux manages the global state, need to use that state for "user" in this component 
  // dispatch - Get reference to dispatch function from react-redux 
  const dispatch = useDispatch();
  // Get the user state using useSelector
  // state here is the entire redux state, we only want the user state 
  // user - will be object with attributes of loading, error and userInfo
  const user = useSelector((state) => state.user)
  // Get the userInfo piece of state, dont need loading and error 
  const {userInfo} = user;


  // logoutHandler //
  // Description:
  //  This function is executed when the logout button is clicked 
  //  It dispatched the logout action which resets the user redux state to nothing and clears local staorage 
  function logoutHandler(event){
    // Dispatch the logout action 
    dispatch(logout());
  }

  // JSX //
  // This return uses conitional rendering to show login button if user not logged in 
  // If a user is logged in then it shows username and dropdown menu for profile and logout button 
  // see here for conditional rendering https://reactjs.org/docs/conditional-rendering.html
  return (
    <header className="pb-4">
       <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
            <Navbar.Brand as={Link} to="/"><i className="fas fa-video px-1"></i>Movie Reviews</Navbar.Brand>
            <Nav>
            {userInfo ?
            (<NavDropdown align="end" title={userInfo.firstName}>
                
                <NavDropdown.Item as={Link} to="/profile"><i className="fas fa-user px-1"></i>My Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}><i className="fas fa-sign-out-alt px-1"></i>Logout</NavDropdown.Item>
            </NavDropdown>)
            : <Nav.Link as={Link} to="/login"><i className="fas fa-user px-2"></i>Login</Nav.Link> 
            } 
            </Nav>
        </Container>   
        </Navbar>  
    </header>
  );
}

export default Header;