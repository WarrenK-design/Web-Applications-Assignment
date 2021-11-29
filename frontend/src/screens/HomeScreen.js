/// Description:
//  This is the page the user sees when they first enter the application 
//  It displays all the movies in the sight and then the user can sort through them 

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
// useNavigate - Allows you to programtically redirect, see https://reactrouter.com/docs/en/v6/api#usenavigate
// Link - Used for the link to login route 
import {useState,useEffect} from 'react';
import axios from 'axios';

/// Components ///
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
// MovieCard      - This component is to display an individula movie
import LoadingSpinner from "../components/LoadingSpinner";
import MessageAlert from "../components/MessageAlert";
import MovieCard from '../components/MovieCard';

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Button} from "react-bootstrap";



/// HomeScreen ///
// Description:
//  Component which is displayed at the route /
//  Internally it holds all of the movie components 
function HomeScreen() {
  /// State ///
  // loading      - This is to first wait untill all the relevant information has been retrieved from backend
  // movies       - This is to hold the movies returned from the API 
  // error        - If there is an error returned from the API call to get the movies need to set it so is displayed 
  // pageNum      - The API to get the movies uses pagnigation, this value tells the API which movies to return 
  const [loading, setLoading] = useState(true);
  const [movies, setMovies]   = useState('');
  const [error, setError]     = useState('');
  const [pageNum,setPageNum]  = useState(0);

  /// useEffect ///
  // Description:
  //  This makes the API call to get the movies at /movies
  //  Is executed once the component renders, component renders loading first due to loading state
  useEffect (() => {
    /// getMovies ///
    // Description:
    //  Makes a GET request to the backend route /movies/:pageNumber 
    //  The page number is incrmened using the buttons on the page 
    const getMovies = async () => { 
      try{
        // Set the request information using the pagenumber 
        let profileImageRequest = {
            method: 'get',
            url: `/movies/${pageNum}`
            }
        // Send the request with axios, will return users details 
        const res = await axios(profileImageRequest);
        // Set the state for the movies and loading to false 
        setMovies(res.data);
        window.scrollTo(0, 0);
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
    getMovies();
  },[pageNum]) // Anytime page number changes run this function 

  /// return ///
  // Loading = True -> Return LoadingSpinner
  // error   = True -> Return MessageAlert and pass the user friendly error returend from API to user 
  // error & Loading = False -> Return a container with movie components and a next/back button to increment pageNum
  return (
    <>
      <h1>Movies</h1>
      {loading ? <LoadingSpinner/> : error ? <MessageAlert variant="danger">{error}</MessageAlert>:
      <Container>
        <Row  md={4} xs={2}>
        {movies.map((movie) =>(
          <Col className="py-2" key={movie._id}>
            <MovieCard movie={movie}/>
          </Col>
        ))} 
      </Row>
      <Row>
        <Col>
          <Button disabled={pageNum === 0} onClick={() => setPageNum(pageNum-1)}>
            Back
          </Button>
        </Col>
        <Col style={{"textAlign":"right"}}>
        <Button disabled={pageNum===24} onClick={() => setPageNum(pageNum+1)}>
            Next
          </Button>
        </Col>
      </Row>
      </Container>
      }
      </> 
  );
}

export default HomeScreen;