/// Description:
//  This is the page the user sees when they first enter the application 
//  It displays all the movies in the sight and then the user can sort through them 

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
// useNavigate - Allows you to programtically redirect, see https://reactrouter.com/docs/en/v6/api#usenavigate
// Link - Used for the link to login route 
// axios - Used to make http requests 
import {useState,useEffect} from 'react';
import axios from 'axios';
import {useParams,useNavigate} from 'react-router-dom';

/// Components ///
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
// MovieCard      - This component is to display an individula movie
import LoadingSpinner from "../components/Widgets/LoadingSpinner";
import MessageAlert from "../components/Widgets/MessageAlert";
import MovieCard from '../components/Movie/MovieCard';

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Button} from "react-bootstrap";

/// HomeScreen ///
// Description:
//  Component which is displayed at the route /<PAGENUM> and /search/<PAGENUM>/<CATEGORY>/<KEYWORD>
//  Internally it displays sall he movie cards giving a preview of the movies 
function HomeScreen() {
  /// State ///
  // loading      - This is to first wait untill all the relevant information has been retrieved from backend
  // movies       - This is to hold the movies returned from the API 
  // error        - If there is an error returned from the API call to get the movies need to set it so is displayed 
  // noResults    - Used if there are no results to be displayed, for example a search query returned no results 
  const [loading, setLoading]     = useState(true);
  const [movies, setMovies]       = useState('');
  const [error, setError]         = useState('');
  const [noResults, setNoResults] = useState('')

  /// Params ///
  // This component is used for both the / and /search/:category/:keyword route 
  // if the /search route need to get the params for category and keyword to be used in the search API call
  const {category, keyword, pageNumber} = useParams(); 

  // navigate - It is a function that lets you naviagte programitically for redircts
  const navigate = useNavigate();

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
        // Set loading true as we are calling API 
        setLoading(true);
        // Reset no results, will be set again is no results returned 
        setNoResults('');
        // Set the request information using the pagenumber 
        let moviesRequest = {
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/movies/${pageNumber}/?category=${category}&keyword=${keyword}`
            }
        // Send the request with axios, will return users details 
        const res = await axios(moviesRequest);
        console.log(res.data)
        // Check if results are empty 
        if(res.data.length === 0){
          // Set the no results message
          setNoResults("No Results Found, Try Another Search Query");
        }
        // Set the state for the movies and loading to false 
        setMovies(res.data);
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
  },[keyword,category,pageNumber]) // Anytime page number changes run this function 

  /// return ///
  // Loading = True -> Return LoadingSpinner
  // error   = True -> Return MessageAlert and pass the user friendly error returend from API to user 
  // error & Loading = False -> Return a container for movie components
  // noResults = True -> Display a message to the user to try another search query 
  // noResults = False -> For every movie show a movie card and the buttons to change pages
  return (
    <>
      <h1>Movies</h1>
      {loading ? <LoadingSpinner/> : error ? <MessageAlert variant="danger">{error}</MessageAlert>:
      <Container>
        
          {noResults ? <MessageAlert variant="danger">{noResults}</MessageAlert>
          :
          <>
          <Row  md={4} xs={1}>
            {movies.map((movie) =>(
          <Col className="py-2" key={movie._id}>
            <MovieCard movie={movie}/>
          </Col>
        ))}
        </Row>
        <Row>
        <Col>
          <Button 
            disabled={parseInt(pageNumber) === 0} 
            onClick={() => {
              if(keyword){
                // Naviagte to previous search page 
                navigate(`/search/${parseInt(pageNumber)-1}/${category}/${keyword}/`)
              }else{
                // Navigate to previous regular page 
                navigate(`/${parseInt(pageNumber)-1}`)
              }
            }}>
            Back
          </Button>
        </Col>
        <Col style={{"textAlign":"right"}}>
        <Button 
          disabled={movies.length <20} 
          onClick={() => {
            if(keyword){
              // Naviagte to next search page 
              navigate(`/search/${parseInt(pageNumber)+1}/${category}/${keyword}/`)
            }else{
              // Navigate to next regular page 
              navigate(`/${parseInt(pageNumber)+1}`)}
            }
            }
            >
            Next
          </Button>
        </Col>
      </Row>
      </>
      } 
      </Container>
      }
      </> 
  );
}

export default HomeScreen;