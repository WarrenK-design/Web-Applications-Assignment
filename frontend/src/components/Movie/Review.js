/// Description:
//  This component is used on a movie screen to display the reviews associated with that movie 

/// Imports ///
// useState  - Stateful component, https://reactjs.org/docs/hooks-state.html
// axios - Used for sending http requests 
import {useState} from 'react';
import axios from 'axios';

/// Bootsrap ///
// Card   - https://react-bootstrap.github.io/components/cards/
// Button - https://react-bootstrap.github.io/components/buttons/ 
import {Card,Button} from "react-bootstrap";

// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user
import LoadingSpinner from "../Widgets/LoadingSpinner";
import MessageAlert from "../Widgets/MessageAlert";



// Redux //
// useSelector - Used to get the redux global state  https://react-redux.js.org/api/hooks
import {useSelector} from 'react-redux';



/// Reviews ///
// Description:
//  Used to display the reviews associated with a movie on the movie page 
// Props:
//  movieId - The id of the movie the reviews are associated with 
//  reviews - An array of reviews associated with a gven film. Each item in the array has a reviewer, comments and score associated with it 
function Review({movieId,review}){
    /// State ///
    // loading       - Used to show that the review deleteion is processing 
    // reviewError   - Used to display a message to the user if the deleteion of the review could not be procssed
    // reviewMessage - Used to display a success message to the user 
    const [reviewLoading,setLoading]             = useState(false);
    const [reviewError,setReviewError]     = useState("");
    const [reviewMessage,setReviewMessage] = useState("");

    /// Redux ///
    // Get the user state using useSelector
    // state here is the entire redux state, we only want the user state 
    // user - will be object with attributes of loading, error and userInfo
    const user = useSelector((state) => state.user)
    const {userInfo} = user;

    /// SubmitHandler ///
    // Description:
    //  If a user is logged in the should be able to delete there posted comments
    //  This function is called when the delete button is clicked 
    const handleSubmit = async(reviewId) =>{
        try{
            // Set the states 
            setReviewError("");
            setReviewMessage("");
            setLoading(true);
            // Buil the request configuration //
            let requestConfig = {
                method: 'delete',
                url: `${process.env.REACT_APP_API_URL}/movies/reviews/${movieId}`,
                data: {
                    reviewId: reviewId
                },
                headers: {
                    authorization: `Bearer ${userInfo.jwt}`
              }
            };
            // Send the request using axios 
            await axios(requestConfig);
            setReviewMessage("The review has been deleted");
            setLoading(false);
        }catch(error){
            // Log the error 
            console.log(error);        
            // Set the human readible message to be displayed on the page 
            setReviewError(error.response.data.errormessage);
            setLoading(false);            
        }
    }

    /// If the reviewMessage has something then the review has been succefully deleted display success in place of review
    if(reviewMessage){
        return(
            <Card key={review._id} className="mb-3">
                {reviewMessage && <MessageAlert variant='success'>{reviewMessage}</MessageAlert>} 
            </Card>
        );
    }
    // Else just return the review, if it belongs to the current user then a delete button should be available 
    else{
        return(
                <Card key={review._id} className="mb-3">
                    {reviewError && <MessageAlert variant='danger'>{reviewError}</MessageAlert>}  
                    {reviewLoading && <LoadingSpinner/>}
                    <Card.Body> 
                        <Card.Title>{review.headline}</Card.Title>
                        <Card.Subtitle className="mb-1 text-muted">{review.reviewer.firstName} {review.reviewer.secondName}</Card.Subtitle>
                        <Card.Subtitle className="mb-1 text-muted">{new Date(review.createdAt).toDateString()  }</Card.Subtitle>
                        <span>
                           {[...Array(review.score)].map((e,i) => <i style={{color:"yellow"}}key={i} className="fa fa-star px-1"/>)}
                            {[...Array(10-review.score)].map((e,i) => <i key={i} className="far fa-star px-1"/>)} 
                        </span>
                    <Card.Text>
                        {review.comments}
                    </Card.Text>
                    {userInfo && review.reviewer._id === userInfo.id && 
                    <Button
                        value={review.reviewer._id}
                        variant="danger"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(review._id)}}
                    >
                        Delete
                    </Button>
                    }
                    </Card.Body>
                </Card>
            );}
}

export default Review;