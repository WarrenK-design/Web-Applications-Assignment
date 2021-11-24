// Description:
//  This component can be used to wrap forms so all forms in the app look the same 
//  forms are used in login, sign up so makes sense to wrap these and have same layout avoids duplicate code 
//  It uses reactbootstrap for layout see https://react-bootstrap.github.io/layout/grid/


/// Imports ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col } from "react-bootstrap";

/// FormContainer ///
// Descrption:
//  Container component to wrap any forms in the application so they all have the same layout 
// Props:
//  children - This will be the JSX the container wraps, see explanantion of children here https://reactjs.org/docs/composition-vs-inheritance.html
function FormContainer ({children}) {
    return(
        <Container>
            <Row className='justify-content-center'> {/*Justify center on medium size screens*/}
                <Col xs={12} md={5}> {/*Small screen fit 12 cols next to eachother, medium screen fit 5*/}
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer;