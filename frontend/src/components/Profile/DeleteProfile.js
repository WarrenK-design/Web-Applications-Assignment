/// Description:
//  This component provides the functionality for deleteing a users profile

/// Imports ///
// useState  - Stateful component, email and password fields, https://reactjs.org/docs/hooks-state.html
// axios - Used for making http requests 
import {useState} from 'react';
import axios from 'axios';


// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user
import LoadingSpinner from "../Widgets/LoadingSpinner";
import MessageAlert from "../Widgets/MessageAlert";


/// Bootstrap ///
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
// Button    - Used for the update profile image button
// Modal     - Used to show input for file  
import {Row,Col,Button,Modal} from "react-bootstrap";

// Redux //
// useDispatch - Used for dispatching redux actions, when a user deletes there profile we dispatch the logout action 
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
import {useDispatch,useSelector} from 'react-redux';
import {logout} from '../../actions/userActions';


/// DeleteProfile ///
// Description:
//  Used to delete a profile, holds a button and displays a modal for the 
//  are you sure pop up
function DeleteProfile(){
    /// State ///
    // showModal - When user clicks the "Delete Profile" button an are oyu sure modal should display 
    // loading   - Used to display loading spinner to show deleteion is in progress
    // error     - Used to show error message if there is an error in deleteing the profile
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    /// Redux ///
    // Description:
    //  Redux manages the global state, need to use that state for "user"
    //  state - The entire redux state 
    //  user - Will be object with attributes of loading, error and userInfo
    const user = useSelector((state) => state.user);
    // Only need the userInfo part of user for this component 
    const {userInfo} = user;
    // dispatch - Get reference to dispatch function from react-redux, need to dispatch the logout action 
    const dispatch = useDispatch();


    /// handleSubmit ///
    // Description:
    //  This function is called when a user confirms that they want to delete there profile
     //  event - The button event
    const handleSubmit = async(event) =>{
        try{
            // Set Loading true and reset the error, will be set again if there is an error
            setLoading(true);
            setError('');
            // Prepare the request 
            let profileDeleteRequest = {
                method: 'delete',
                url: `${process.env.REACT_APP_API_URL}/user/profile`,
                headers: {
                    authorization: `Bearer ${userInfo.jwt}`
                }
            };
            // Send the request with axios, will return users details 
            await axios(profileDeleteRequest);
            // Dispatch the logout action -> User no longer exists clear the redux state too, will update the display 
            setLoading(false);
            dispatch(logout());
        }catch(error){
            // The API if running will always send back this message 
            setError(error.response.data.errormessage);
            // No longer loading
            setLoading(false);  
        }
    }

    return(
        <>
            <Row className="pb-3">
                <Col className="text-center">
                <Button
                variant ="danger"
                onClick={(e) => {
                    e.preventDefault();
                    setShowModal(true);
                }}>
                    Delete Profile
                </Button>
                </Col>
            </Row>
             <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <LoadingSpinner/>}
                    {error && <MessageAlert variant="danger">{error}</MessageAlert>}
                    <p>Are you sure you want to delete your profile? </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>{
                        e.preventDefault();
                        setShowModal(false);
                    }}>
                    Close
                    </Button> 
                    <Button variant="danger" onClick={handleSubmit}>
                    Delete Profile
                    </Button> 
                </Modal.Footer>

             </Modal>
        </>
    );
};

export default DeleteProfile;