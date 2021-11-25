/// Description:
//  This displays a logged in users profile, associated with the user 
//  is a profile image and a list of their movies that they added to there collection  

/// Imports ///


/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Image } from "react-bootstrap";

function ProfileScreen() {
  return (
    <Container>
      <Row>
        <Col xs={6} md={4} >
          <Image src="holder.js/121x180" rounded></Image>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileScreen;