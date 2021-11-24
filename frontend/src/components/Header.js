/// Description:
//  This component is the header which appears at the top of every page 

// Imports //
// Link - Want to use bootstraps Nav.Link component, but need it to behave like a Link react-router-dom component
//        by default it behaves like a ahref which will cause a rerender of components in react 
import {Link} from 'react-router-dom';

// Bootstrap //
import {Container,Navbar,Nav} from 'react-bootstrap';

/// Header ///
// Header is displayed on every page, 
// Holds the navigation bar along with the search bar 
function Header() {
  return (
    <header className="pb-4">
       <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
            <Navbar.Brand as={Link} to="/">Movie Reviews</Navbar.Brand>
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link> 
            </Nav>
        </Container>   
        </Navbar>  
    </header>
  );
}
//<LinkContainer to="/login">
//                <Nav.Link><i className="fas fa-user px-2"></i>Login</Nav.Link>
//              </LinkContainer>
export default Header;