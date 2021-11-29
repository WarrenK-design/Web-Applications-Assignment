/// Description:
//  This component is used to display movies to the user
//  It is a card which shows an overview of the movie showing some key details 


/// Bootstrap ///
// Card - Container for a card https://react-bootstrap.github.io/components/cards/
import {Card, ListGroup, ListGroupItem} from "react-bootstrap";
import { Link } from "react-router-dom";


/// MovieCard ///
// Description:
//  Uses the card element to display some information about a movie
// Props:
//  movie - This is a movie object returned from an API call with the movie attributes 
function MovieCard({movie}){


    return(
        <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none'}}>
        <Card className="h-100">
            <Card.Body>
                <Card.Title style={{ color: 'black' }}>{movie.original_title}</Card.Title>
                <Card.Text style={{ color: 'black' }} className="p">
                    {movie.description}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem><strong>Director:</strong> {movie.director}</ListGroupItem>
                <ListGroupItem><strong>Genre:</strong> {movie.genre}</ListGroupItem>
                <ListGroupItem><strong>Runtime:</strong> {movie.duration} mins</ListGroupItem>
                <ListGroupItem><strong>Year:</strong> {movie.year}</ListGroupItem>
                </ListGroup>
        </Card>
        </Link>
        )

}


export default MovieCard;