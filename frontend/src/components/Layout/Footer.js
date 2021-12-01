/// Description:
//  This component is the header which appears at the bottom of every page

// Bootstap 
import {Container,Row,Col} from 'react-bootstrap'



function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center pb-2">
            C16463344 Warren Kavanagh
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;