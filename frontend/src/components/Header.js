/// Description:
//  This component is the header which appears at the top of every page 

// Bootstrap //
import {Container,Navbar,Nav, NavDropdown} from 'react-bootstrap';

/// Header ///
// Header is displayed on every page, 
// Holds the navigation bar along with the search bar 
function Header() {
  return (
    <header>
       <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
            <Navbar.Brand href="/">Movie Reviews</Navbar.Brand>
            <Nav>
              <Nav.Link href="/login"><i class="fas fa-user px-2"></i>Login</Nav.Link>
            </Nav>
        </Container>   
        </Navbar>  
    </header>
  );
}

export default Header;