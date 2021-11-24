/// Description:
//  Screen displays a login form for the user to fill out and sends request 
//  to the backend 


// Imports //
import {Form,Button,Row,Col} from 'react-bootstrap';

// Components //
import FormContainer from "../components/FormContainer";


// Redux //

function LoginScreen() {
  return (
    <FormContainer>
      <h1 className="pt-2"style={{textAlign:'center'}}>Login</h1> 
      <Form>
        <Form.Group className="py-2" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Email Address" />
        </Form.Group>

        <Form.Group className="py-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Row> 
          <Col className='text-center py-3'>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Col>
        </Row>
      </Form>
    </FormContainer>
    );
}

export default LoginScreen;