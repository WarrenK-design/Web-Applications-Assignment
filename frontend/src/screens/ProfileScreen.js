/// Description:
//  This displays a logged in users profile, associated with the user 
//  is a profile image and a list of their movies that they added to there collection  

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, https://reactjs.org/docs/hooks-effect.html 
// useNavigate - Allows you to programtically redirect, see https://reactrouter.com/docs/en/v6/api#usenavigate
// Link - Used for the link to login route 
import {useState,useEffect} from 'react';
import {useNavigate,Link } from "react-router-dom";
import axios from 'axios';

// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
import LoadingSpinner from "../components/Widgets/LoadingSpinner";
import MessageAlert from "../components/Widgets/MessageAlert";
import MovieCard from "../components/Movie/MovieCard";
import ProfilePicture from '../components/Profile/ProfilePicture';
import EditProfile from '../components/Profile/EditProfile';

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Image,Card } from "react-bootstrap";

// Redux //
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
import {useSelector} from 'react-redux';

function ProfileScreen() {
  /// state ///
  // loading      - This is to first wait untill all the relevant information has been retrieved from backend
  const [loading, setLoading]           = useState(true);

  // navigate - It is a function that lets you naviagte programitically for redircts, used in useEffect below 
  const navigate = useNavigate();

  /// Redux ///
  // Description:
  //  Redux manages the global state, need to use that state for "user"
  //  state - The entire redux state 
  //  user - Will be object with attributes of loading, error and userInfo
  const user = useSelector((state) => state.user);
  // Only need the userInfo part of user for this component 
  const {userInfo} = user;

  /// useEffect ///
  // Description:
  //  Using the useEffect hook here to make sure there is a user logged in and then calling API to get its profile image 
  //  If there is no user logged in then redirect to the login screen 
  useEffect (() => {
    function getProfileData() {
      // Show the loading spinner 
      setLoading(true);
      // Check if userInfo has something in it 
      if(userInfo){
        // Load the page 
        setLoading(false);
      }else{
        // No user so redirect to Login 
        navigate('/login');
        setLoading(false);
      }
    }
    getProfileData();    
  },[userInfo,navigate])

  /// return ///
  // loading = True - Show the loading spinner 
  // loading = False - Render the page 
  // userInfor = True - Display the users information 
  // userInfo = False - Will redirect to login page, user is not logged in or user was logged in and has clicked log out button now
  return(
  <Container>
    {loading ? (<LoadingSpinner/>)
    :
    <>
      {userInfo && 
      <>
      <ProfilePicture/>
      <Row>
        <Col className="text-center">
          <h1>{userInfo.firstName} {userInfo.secondName}</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <EditProfile/>
        </Col>
      </Row>
        <Card>
          <Card.Body>
            <Card.Title><h2>My Movies</h2></Card.Title>
              {userInfo.myMovies.length > 0 ?(
                <Row md={3} xs={1}>
                  {userInfo.myMovies.map((movieObj) =>(
                  <Col className="py-2" key={movieObj._id}>
                    <MovieCard movie={movieObj.movie}/>
                  </Col>
                ))} 
                </Row>)
              :<Card.Text>
                Looks like you have no movies on your list yet.
                You can add a film to the My Movies section by clciking on the "Add to My Movies"
                button in each of the movies pages. 
                Explore some films <Link className='pl-1' to='/'>here</Link>
              </Card.Text>} 
          </Card.Body>
        </Card>
      </>}
      </>
  }     
  </Container>
      )
    };

export default ProfileScreen;