/// Description:
//  This component is for the profile picture 
//  It includes rendering the profile picture but also the ability to update a profile picture 


/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, https://reactjs.org/docs/hooks-effect.html 
// axios - Used for making http requests 
// FormData - Used for submitting files, needed here for new profile image upload 
import {useState,useEffect} from 'react';
import axios from 'axios';
import FormData from 'form-data';

// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user
import LoadingSpinner from "../Widgets/LoadingSpinner";
import MessageAlert from "../Widgets/MessageAlert";

/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
// Image     - Used for displaying profile image 
// Button    - Used for the update profile image button
// Modal     - Used to show input for file  
import { Container,Row,Col,Image,Button,Modal,Form} from "react-bootstrap";


// Redux //
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
import {useSelector} from 'react-redux';


/// ProfilePicture
//  Description:
//      Component to display the profile picture on the users page and the ability to change a profile picture
function ProfilePicture(){
    /// state ///
    // loading      - This is to first wait until the profile image has been retrieved from the backend 
    // profileImage - This is the users profile image 
    // showModal    - Used for displaying the upload profile image modal
    // newProfileImage - Stores the file of the newProfileImage
    // uploadLoading    - Used to show loading icon in modal when uploading photo 
    // uploadError  - Used to show an error to the user if there was an error uploading 
    // uploadSuccessMessage - Used to indicate to the user the upload was a success 
    const [loading, setLoading]                 = useState(true);
    const [profileImage, setProfileImage]       = useState('');
    const [showModal, setShowModal]             = useState(false);
    const [newProfileImage,setNewProfileImage]  = useState('');
    const [uploadLoading, setUploadLoading]     = useState(false);
    const [uploadError, setUploadError]         = useState('');
    const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

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
        // Set the http request configuration 
        let profileImageRequest = {
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/user/profileimage`,
          responseType: 'arraybuffer',
          headers: {
            authorization: `Bearer ${userInfo.jwt}`
          }
        };
        // Send the request with axios, will return users details 
        const res = await axios(profileImageRequest);
        let image = Buffer.from(res.data, 'binary').toString('base64')
        //console.log(JSON.stringify(res.data));
        // Set the profile image 
        setProfileImage(image);
        setLoading(false);

      }catch(error){
        console.log(error);
      }
    }
    getProfileData();    
  },[userInfo,uploadSuccessMessage])

    /// handleSubmit ///
    // Description:
    //  Function is called when the upload image button is clicked 
    //  It handles the upload of a new profile image  
    // Inputs:
    //  event - The button event
    const handleSubmit = async(event) =>{
        try{
            // By default on submit there will be page
            event.preventDefault();
            // Set loading to true to show process taking place
            setUploadLoading(true);
            // Reset the error and success messages as new ones will be generated 
            setUploadSuccessMessage("");
            setUploadError("");
            // Instanciate a anew form data object, package used for sending files 
            var data = new FormData();
            // Add the selected fil to the form data, this will be in the newProfileImage state
            data.append('file', newProfileImage);
            // Create the request configuration 
            let uploadImageRequest = {
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/uploads/profileimage`,
                headers: {
                authorization: `Bearer ${userInfo.jwt}`
                },
                data: data
            };
            // Send the request 
            let res = await axios(uploadImageRequest);
            // Set the succuess meassge -> Will display success message but will also update the profile image as useEffect will be called 
            setUploadSuccessMessage("Profile image has been successfully updated");
            setUploadLoading(false);
        }catch(error){
            // The API if running will always send back this message 
            setUploadError(error.response.data.errormessage);
            // No longer loading
            setUploadLoading(false);  
        }
    }  

    /// return ///
    // loading = True return loading spinner 
    // loading - False render the compnent and display the image and the upload image button 
    // showModal = True, user has clicked the upload image button show the modal for the upload form 
    // showModal & uploadLoading = True, - Show the loading of upload in modal 
    // showModal & uploadSuccessMessage = True, - Show the success message in the modal 
    // showModal & uploadError = True, shwo the upload error in the modal 
    return(
        <>
        {loading ? (<LoadingSpinner/>)
        :
        <>
        <Row className="pb-3 justify-content-md-center">
            <Col md={5} className="text-center">
            <Image className="img-thumbnail mx-auto" src={`data:image/png;base64,${profileImage}`} roundedCircle fluid/>
            </Col>
        </Row>
        <Row className="pb-3">
            <Col className="text-center">
              <Button
                onClick={(e)=>{
                    e.preventDefault();
                    setShowModal(true);
                }}
              >Update Profile Image</Button>
            </Col>
        </Row> 
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
            
            <Modal.Header closeButton>
                <Modal.Title>Upload a profile picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {uploadLoading && <LoadingSpinner/>}
                {uploadSuccessMessage && <MessageAlert variant="success">{uploadSuccessMessage}</MessageAlert>}
                {uploadError && <MessageAlert variant="danger">{uploadError}</MessageAlert>}
                <Form.Group>
                    <Form.Label>Select a new profile image</Form.Label>
                    <Form.Control 
                    type="file" 
                    onChange={(event) => setNewProfileImage(event.target.files[0])}
                    />                        
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={(e)=>{
                e.preventDefault();
                setShowModal(false);
            }}>
                Close
            </Button> 
            <Button 
                variant="primary" 
                disabled={newProfileImage == ''}
                onClick={handleSubmit}
                >
                Upload Image
            </Button> 
            </Modal.Footer>
            
        </Modal>
        </>
}
        </>
    );
}

export default ProfilePicture;