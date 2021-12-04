/// Description:
//  This screen is used to display an individual movie navigated to by clicking a movie on the home screen
//  This is a dynamic route having the url /movie/:id

/// Imports ///
// useState  - Stateful component, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, https://reactjs.org/docs/hooks-effect.html 
// useParams - Used to get the id from the url params 
// axios     - Used for sending http requests to backend 
import {useState,useEffect} from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';

// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
// MovieDetails   - Component to display the movie details 
// Reviews        - Component used to hold a review 
// AddReview      - Component for creating a review 
import LoadingSpinner from "../components/Widgets/LoadingSpinner";
import MessageAlert from "../components/Widgets/MessageAlert";
import MovieDetails from '../components/Movie/MovieDetails';
import Review      from '../components/Movie/Review';
import AddDeleteMyMovie from '../components/Movie/AddDeleteMyMovie';
import AddReview from '../components/Movie/AddReview';

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import {Container,Row,Col,Form,Card,Button,Dropdown} from "react-bootstrap";

// Redux //
// Want to give the user an option to submit a review if they are logged in 
// useSelector     - Used to get the redux global state  https://react-redux.js.org/api/hooks
// updateMovieList - This action is used to update the movie list adding/deleting movies 
import {useSelector} from 'react-redux';

/// MovieScreen
// Description:
//  This component will display an individual movie on the webpage 
function MovieScreen() {
    /// State ///
    // loading                - This is to first wait untill all the relevant information has been retrieved from backend
    // movie                  - This is to hold the movie returned from the API 
    // error                  - If there is an error returned from the API call to get the movie need to set it so is displayed 
    const [loading, setLoading]                = useState(true);
    const [movie, setMovie]                    = useState('');
    const [error, setError]                    = useState("");

    /// Redux ///
    // Description:
    //  Redux manages the global state, need to use that state for "user"
    //  user as we need to see if a user is logged in or not 
    //  state here is the entire redux state, we only want the user state 
    // user - will be object with attributes of loading, error and userInfo
    const user = useSelector((state) => state.user);
    // Get the userInfo piece of state, dont need loading and error 
    const {userInfo} = user;    

    // id         - This is passed as a url param as it is a dynamic route 
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
                url: `${process.env.REACT_APP_API_URL}/movies/byId/${id}`
                }
            // Send the request with axios, will return users details 
            const res = await axios(movieRequest);
             // Set the state for the movies and loading to false 
            setMovie(res.data);
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
  },[id])

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
              <Col>
                <p>{movie.description}</p>
              </Col> 
            </Row>
            {userInfo && 
            <Row className="pb-3"> 
              <Col>
                <AddDeleteMyMovie movieId={id}/>
              </Col>
            </Row>
            }
            <Row>
            <Col>
                <h2>Details</h2>
                <MovieDetails movie={movie} />
            </Col>
            </Row>
            <h2>Reviews</h2>
            {userInfo ? (
              <Row>
                <Col className='pb-4'>
                  <AddReview movieId={id}/>
                </Col>
              </Row>
            )
            :      
              <Row>
                <Col className='text-center pb-2'>
                  <h5>
                  Want to review {movie.original_title}?  
                  <Link className='px-1' to='/login'>Sign In</Link>
                  or<Link className='px-1' to='/register'>Register</Link>
                  today!
                  </h5>
                </Col>
              </Row>
            }
            <Row>
              <Col>
              {movie.reviews.length > 0 ?
              (movie.reviews.map((review) =>(<Review movieId={movie._id} review={review}> </Review>)))
              :
              <Card className="mb-3">
                <Card.Body>
                    <Card.Title>No Reviews Yet</Card.Title>
                    <Card.Text>
                        No reviews have been posted for this film yet!
                    </Card.Text>
                </Card.Body>
            </Card>
              }
              </Col>
            </Row>
      </Container>
      }
      </> 
);
}
export default MovieScreen;