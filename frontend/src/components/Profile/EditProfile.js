// Description:
//  This component is used to edit a logged in users profile
//  A user can update their first name, second name, email and password 

/// Imports ///
// useState  - Stateful component, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, https://reactjs.org/docs/hooks-effect.html 
import {useState,useEffect} from 'react';


/// Components ///
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user
import LoadingSpinner from "../Widgets/LoadingSpinner";
import MessageAlert from "../Widgets/MessageAlert";

/// Bootstrap ///
// Card - https://react-bootstrap.github.io/components/cards/
// Form - https://react-bootstrap.github.io/components/forms/ 
// Button - https://react-bootstrap.github.io/components/buttons/
import {Form,Card,Button} from "react-bootstrap";

// Redux //
// Want to give the user an option to submit a review if they are logged in 
// useSelector     - Used to get the redux global state  https://react-redux.js.org/api/hooks
// useDispatch  - Used to call redux actions to update the state https://react-redux.js.org/api/hooks#usedispatch
// updateUser - This action is used to update the users profile
import {useSelector,useDispatch} from 'react-redux';
import {updateUser} from '../../actions/userActions';
import {USER_UPDATE_RESET} from '../../constants/userActionConstants';


/// EditProfile ///
// Description:
//  This component will 
function EditProfile(){
    /// state ///
    // email            - Used to update the users email 
    // firstName        - Used to update the users firstName
    // secondName       - Used to update the users secondName
    // password         - Used to update the users password
    // confirmPassword  - Used to confirm the users password 
    // formError        - Used for showing a form error in validation to user, eg password not equal to confirm password 
    const [email, setEmail]                    = useState("");
    const [firstName,setFirstName]             = useState("");
    const [secondName,setSecondName]           = useState("");
    const [password,setPassword]               = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [formError,setFormError]             = useState("");

    /// Redux ///
    // Description:
    //  Redux manages the global state, need to use that state for "user"
    //  state here is the entire redux state, we only want the user state 
    // dispatch - Get reference to dispatch function from react-redux, used for dispatching actions 
    const dispatch = useDispatch();
    // user - will be object with attributes of loading, error and userInfo
    const user       = useSelector((state) => state.user);
    const userUpdate = useSelector((state) => state.userUpdate);
    // Get the userInfo piece of state, dont need loading and error 
    const {userInfo} = user;    
    // Get the userUpdate Loading, Error and Success piece of state 
    const {userUpdateLoading, userUpdateSuccess,userUpdateError} = userUpdate;

    /// useEffect /// 
    // Description: 
    //  Used here to set the placholder initial states to dispaly the users details on the screen 
    useEffect(() => {
        // setThe values for the state so that they appear in the form to be edite  
        setEmail(userInfo.email);
        setFirstName(userInfo.firstName);
        setSecondName(userInfo.secondName);
        // reset the state for the update action as we dont want old messages showing when user navigates to this page from a previoud update
        dispatch({type:USER_UPDATE_RESET})
    },[])



    /// submitHandler ///
    // Description:
    //  Called when a user selects the "updateProfile" button 
    //  A PUT request is sent to /users/profile with the new users details
    //  As this is updating the user and we are storing user state in redux, go though an action to send HTTP 
    const submitHandler = async(event) =>{
        // Prevent default of refreshing page 
        event.preventDefault();
        // Reset formError will be set if a new form error occurs 
        setFormError('');
        // Reset the errors also in the redux update state as new ones will be flagged 
        dispatch({type:USER_UPDATE_RESET})
        // Cant leave email, First name or Second Name blank 
        if(email ==='' || firstName ==='' || secondName ===''){
            setFormError("Email, First Name and Second Name fields are required"); 
        }else if(password !== confirmPassword){// Check that the confirm password and password match 
           setFormError("Password and Confirm new password must match"); 
        }else if (password && password.length < 6){
            setFormError("New password must be at least 6 characthers")
        }else{
            // Form filled in ok dispatch the action to update users profile 
            dispatch(updateUser({email,firstName,secondName,password}))
        }
    }

    /// Return ///
    return(
        <Card>
            <Card.Body>
                {formError && <MessageAlert variant="danger">{formError}</MessageAlert>}
                {userUpdateLoading && <LoadingSpinner/>}
                {userUpdateError && <MessageAlert variant="danger">{userUpdateError}</MessageAlert>}
                {userUpdateSuccess && <MessageAlert variant="success">Profile has been updated</MessageAlert>}
                <Card.Title>Edit your details</Card.Title>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            onChange= {(event) => setEmail(event.target.value)} 
                            type="email" 
                            value={email}
                            placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                            onChange= {(event) => setFirstName(event.target.value)} 
                            type="text" 
                            value={firstName}
                            placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Second Name</Form.Label>
                        <Form.Control 
                            onChange= {(event) => setSecondName(event.target.value)} 
                            type="text" 
                            value={secondName}
                            placeholder="Enter second name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            onChange= {(event) => setPassword(event.target.value)} 
                            type="password" 
                            value={password}
                            placeholder="Enter new password" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control 
                            onChange= {(event) => setConfirmPassword(event.target.value)} 
                            type="password" 
                            value={confirmPassword}
                            placeholder="Confirm new password" />
                    </Form.Group>
                    <Button className="mt-3" variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default EditProfile;