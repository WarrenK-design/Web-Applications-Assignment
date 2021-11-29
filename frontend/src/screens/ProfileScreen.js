/// Description:
//  This displays a logged in users profile, associated with the user 
//  is a profile image and a list of their movies that they added to there collection  

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, in this case will redirect if user already signed in, https://reactjs.org/docs/hooks-effect.html 
// useNavigate - Allows you to programtically redirect, see https://reactrouter.com/docs/en/v6/api#usenavigate
// Link - Used for the link to login route 
import {useState,useEffect} from 'react';
import {useNavigate,Link } from "react-router-dom";
import axios from 'axios';

// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
import LoadingSpinner from "../components/LoadingSpinner";
import MessageAlert from "../components/MessageAlert";

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import { Container,Row,Col,Image } from "react-bootstrap";

// Redux //
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
import {useSelector} from 'react-redux';

function ProfileScreen() {
  /// state ///
  // loading      - This is to first wait untill all the relevant information has been retrieved from backend
  // profileImage - This is the users profile image 
  const [loading, setLoading]           = useState(true);
  const [profileImage, setProfileImage] = useState('');

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
    const getProfileData = async () => {
      try{
        // Check if userInfo has something in it 
        if(userInfo){
          // Make a call to backend to get the profile image of user 
          console.log("We madd it")
          // Set the http request configuration 
          let profileImageRequest = {
            method: 'get',
            url: '/user/profileimage',
            responseType: 'arraybuffer',
            headers: {
              authorization: `Bearer ${userInfo.jwt}`
            }
          };
          // Send the request with axios, will return users details 
          const res = await axios(profileImageRequest);
          let image = Buffer.from(res.data, 'binary').toString('base64')
          console.log(image)
          //console.log(JSON.stringify(res.data));
          // Set the profile image 
          setProfileImage(image);
          setLoading(false);

        }else{
          // No user so redirect to Login 
          navigate('/login');
        }
      }catch(error){
        console.log(error);
      }
    }
    getProfileData();    
  },[userInfo,navigate])




  if(loading) {
    return(<LoadingSpinner/>)
  }else{
    return(
<Container>
      <Row>
        <Col className="text-center">
          <Image className="img-thumbnail mx-auto" src={`data:image/png;base64,${profileImage}`} roundedCircle fluid/>
        </Col>
      </Row> 
      <Row>
        <Col className="text-center">
          <h1>{userInfo.firstName} {userInfo.secondName}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          
        </Col>
      </Row>
    </Container>
    )
  };
}

export default ProfileScreen;