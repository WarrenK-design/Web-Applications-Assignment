/// Description:
//  This screen is used to display an individual movie navigated to by clicking a movie on the home screen
//  This is a dynamic route having the url /movie/:id

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
// useParams - Used to get the id from the url params 
import {useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
// MovieDetails   - Component to display the movie details 
// Reviews        - Component used to hold a review 
import LoadingSpinner from "../components/LoadingSpinner";
import MessageAlert from "../components/MessageAlert";
import MovieDetails from '../components/MovieDetails';
import Reviews      from '../components/Reviews';


/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Card, ListGroup, ListGroupItem} from "react-bootstrap";

/// MovieScreen
// Description:
//  This component will display an individual movie on the webpage 
function MovieScreen() {
    /// State ///
    // loading      - This is to first wait untill all the relevant information has been retrieved from backend
    // movie       - This is to hold the movie returned from the API 
    // error        - If there is an error returned from the API call to get the movie need to set it so is displayed 
    const [loading, setLoading] = useState(true);
    const [movie, setMovie]   = useState('');
    const [error, setError]     = useState("");

    /// id ///
    // This is passed as a url param as it is a dynamic route 
    const {id} = useParams();

    /// useEffect ///
    // Description:
    //  This makes the API call to get the movie a t /movies/:id
    //  Is executed once the component renders, component renders loading first due to loading state
    useEffect (() => {
        /// getMovie ///
        // Description:
        //  Makes a GET request to the backend route /movies/:id 
        const getMovie = async () => { 
          try{
            // Request is being sent set loading true 
            setLoading(true);
            // Set the request information using the id 
            let movieRequest = {
                method: 'get',
                url: `/movies/byId/${id}`
                }
            // Send the request with axios, will return users details 
            const res = await axios(movieRequest);
            // Set the state for the movies and loading to false 
            setMovie(res.data);
            console.log(res.data);
            setLoading(false);
          }catch(error){

            // Log the error 
            console.log(error);        
            // Set the human readible message to be displayed on the page 
            setError(error.response.data.errormessage);
            setLoading(false);
          }
        }
        // Call get movies 
        getMovie();
  },[])

    /// return ///
    // Loading = True -> Return LoadingSpinner
    // error   = True -> Return MessageAlert and pass the user friendly error returend from API to user 
    // error & Loading = False -> Return a the movie screen components
    return(
    <>
      {loading ? <LoadingSpinner/> : error ? <MessageAlert variant="danger">{error}</MessageAlert>:
      <Container>
            <Row>
                <Col>
                <h1>{movie.original_title}</h1>
                </Col>
            </Row> 
            <Row>
                <p>{movie.description}</p>
            </Row>
            <Col>
                <h2>Details</h2>
                <MovieDetails movie={movie} />
            </Col>
            <Row>
                <h2>Reviews</h2>
                <Col>
                <Reviews reviews={movie.reviews}/>
                </Col>
            </Row>
      </Container>
      }
      </> 
);
}

export default MovieScreen;