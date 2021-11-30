/// Description:
//  This screen is used to display an individual movie navigated to by clicking a movie on the home screen
//  This is a dynamic route having the url /movie/:id

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
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
import LoadingSpinner from "../components/LoadingSpinner";
import MessageAlert from "../components/MessageAlert";
import MovieDetails from '../components/MovieDetails';
import Reviews      from '../components/Reviews';


/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import {Container,Row,Col,Form,Card,Button,Dropdown} from "react-bootstrap";

// Redux //
// Want to give the user an option to submit a review if they are logged in 
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
import {useSelector} from 'react-redux';

/// MovieScreen
// Description:
//  This component will display an individual movie on the webpage 
function MovieScreen() {
    /// State ///
    // loading      - This is to first wait untill all the relevant information has been retrieved from backend
    // movie       - This is to hold the movie returned from the API 
    // error        - If there is an error returned from the API call to get the movie need to set it so is displayed 
    // headline     - headline user supplies for a movie review 
    // score        - This is the score the user gives when reviewing the movie 
    // comments     - The comments a user supplies with there review 
    const [loading, setLoading]   = useState(true);
    const [movie, setMovie]       = useState('');
    const [error, setError]       = useState("");
    const [headline,setHeadline]  = useState("");
    const [score, setScore]       = useState(0);
    const [comments, setComments] = useState("");
    const [reviewError,setReviewError]     = useState("");
    const [reviewMessage,setReviewMessage] = useState("");
    const [reviewLoading,setReviewLoading] = useState(false);

    /// Redux ///
    // Description:
    //  Redux manages the global state, need to use that state for "user" in this component 
    // Get the user state using useSelector
    // state here is the entire redux state, we only want the user state 
    // user - will be object with attributes of loading, error and userInfo
    const user = useSelector((state) => state.user)
    // Get the userInfo piece of state, dont need loading and error 
    const {userInfo} = user;    
    
    
    
    // id         - This is passed as a url param as it is a dynamic route 
    // scoreOutOf - This is used in the form for subbmitting a review, movies are scored out of 10, need 11 for looping through
    const {id} = useParams();
    const scoreOutOf = 11;

    /// handleSubmit ///
    // Description:
    //  This function handles the submission of form to create a review
    // Inputs:
    //  event - The button event, 
    const handleSubmit = async(event) =>{
      try{
        event.preventDefault();
        // Reset the message states 
        setReviewMessage("");
        setReviewError("");
        setReviewLoading(true);
        // Check that the user has filled out headline and comment 
        if(headline ==='' && comments ===''){
          console.log(headline,comments)
          setReviewError("All fields must be filled out");
          setReviewLoading(false);
        }else{
          // Set the http request configuration 
          // Convert score to a string as check on backend checks as string 
          let requestConfig = {
            method: 'post',
            url: `/movies/reviews/${id}`,
            data: {
              headline:headline,
              comments:comments,
              score: score.toString()
            },
            headers: {
                  authorization: `Bearer ${userInfo.jwt}`
              }
        };
        // Send the request 
        const res = await axios(requestConfig);
        setReviewMessage("Review succesfully posted!");
        setReviewLoading(false); 
        }
    }catch(error){
      // The API if running will always send back this message 
      if(error.response.data.errormessage){
        setReviewError(error.response.data.errormessage);
      }else{
        // If api connection problem set this 
        setReviewError("Review could not be processed at this time");
      }
      // No longer loading review
      setReviewLoading(false);  
    } 
  }


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
            <h2>Reviews</h2>
            {userInfo ?
            (<Row className="pb-4">
              <Col>
                <Card className="pb-4"> 
                 {reviewError && <MessageAlert variant='danger'>{reviewError}</MessageAlert>}  
                 {reviewMessage && <MessageAlert variant='success'>{reviewMessage}</MessageAlert>} 
                 {reviewLoading && <LoadingSpinner/>}
                  <Card.Body> 
                    <Card.Title>Create a review</Card.Title>
                    <Form onSubmit={handleSubmit} className="pb-4">
                      <Form.Group>
                        <Form.Label>Headline</Form.Label>
                        <Form.Control onChange= {(event) => setHeadline(event.target.value)} type="text" placeholder="Great Movie" />
                        <Form.Text>Few words summing up the review</Form.Text>
                      </Form.Group>
                    <Form.Label>Score</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {score}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {[...Array(scoreOutOf)].map((e,i) => 
                            <Dropdown.Item
                              key={i}
                              id={`toggle-review-score-${i}`}
                              type="checkbox"
                              value={i}
                              onClick={(e) => {
                                e.preventDefault();
                                setScore(i)
                                console.log(score)}
                              }
                            > 
                              {i}                            
                            </Dropdown.Item>
                          )}
                      </Dropdown.Menu>
                  </Dropdown>
                  <Form.Group>
                    <Form.Label>Comments</Form.Label>
                    <Form.Control onChange= {(event) => setComments(event.target.value)} as="textarea" placeholder="The movie was thrilling from beginning to end!" />
                    <Form.Text>Give us your taughts on the film</Form.Text>
                  </Form.Group>
                  <Button className="mt-3" variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            )
            :      
            <Row>
              <Col className='text-center pb-2'>
                <h5>
                Want to review {movie.original_title}?  
                <Link className='px-1' to='/login'>Sign In</Link>
                or<Link className='px-1' to='/login'>Register</Link>
                today!
                </h5>
              </Col>
            </Row>
            }
            <Row>
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