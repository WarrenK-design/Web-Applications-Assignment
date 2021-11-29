// Description:
//  This file holds the component for displaying the movie details 
//  This component will be on each of the movie pages 

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Card, ListGroup, ListGroupItem} from "react-bootstrap";

/// MovieDetails ///
// Description:
//  Used to display the details section of the movie page 
// Props:
//  movie - An individual movie object 
function MovieDetails({movie}){
    return(
        <ListGroup variant="flush">
            <ListGroup.Item>
                <Row>
                    <Col><strong>Year</strong></Col>
                    <Col>{movie.year}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Director</strong></Col>
                    <Col>{movie.director}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Writer</strong></Col>
                    <Col>{movie.writer}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Duration</strong></Col>
                    <Col>{movie.duration} mins</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Genre</strong></Col>
                    <Col>{movie.genre.join(", ")}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Cast</strong></Col>
                    <Col>{movie.cast.join(", ")}</Col>
                </Row>
            </ListGroup.Item>
             <ListGroup.Item>
                <Row>
                    <Col><strong>Production Company</strong></Col>
                    <Col>{movie.production_company}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Language</strong></Col>
                    <Col>{movie.language.join(", ")}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item>
                <Row>
                    <Col><strong>Worldwide Gross Income</strong></Col>
                    <Col>$ {movie.worldwide_gross_income}</Col>
                </Row>
            </ListGroup.Item>
        </ListGroup>
    );
}

export default MovieDetails;