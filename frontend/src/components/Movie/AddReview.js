/// Description:
//  This component appears on the movie page to allow a logged in user
//  to submit a review about a film 

/// Imports ///
// useState  - Stateful component, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, https://reactjs.org/docs/hooks-effect.html 
// axios     - Used for sending http requests to backend 
import {useState} from 'react';
import axios from 'axios';

/// Components ///
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
import LoadingSpinner from "../Widgets/LoadingSpinner";
import MessageAlert from "../Widgets/MessageAlert";


/// Bootstrap ///
// Container - Used to structure component 
// Row       - Container divided up into rows 
// Col       - Each row can have multiple columns  
import {Form,Card,Button,Dropdown} from "react-bootstrap";

// Redux //
// Want to give the user an option to submit a review if they are logged in 
// useSelector     - Used to get the redux global state  https://react-redux.js.org/api/hooks
// updateMovieList - This action is used to update the movie list adding/deleting movies 
import {useSelector} from 'react-redux';


/// AddReview ///
//  Description:
//      This component handles the adding of a new review to a movie 
//      The component itself is a card where the user can fill in a headline, score and comments associated with the review 
//      The review is then submitted to the protected route /movies/reviews/${movieId}
//  Props:
//      movieId - The movieId number to identify the movie by, needed when send request  
function AddReview({movieId}){
    /// state ///
    // headline               - headline user supplies for a movie review 
    // score                  - This is the score the user gives when reviewing the movie 
    // comments               - The comments a user supplies with there review 
    // reviewError            - When a user submits a review if there is an error this is set 
    // reviewMessage          - When a user submits a review succefully this is used to update the view showing a success message 
    // reviewLoading          - This is used to show that a review is in the process of being submitted 
    const [headline,setHeadline]               = useState("");
    const [score, setScore]                    = useState(0);
    const [comments, setComments]              = useState("");
    const [reviewError,setReviewError]         = useState("");
    const [reviewMessage,setReviewMessage]     = useState("");
    const [reviewLoading,setReviewLoading]     = useState(false);

    /// Redux ///
    // Description:
    //  Redux manages the global state, need to use that state for "user"
    //  user as we need to see if a user is logged in or not
    //  state here is the entire redux state, we only want the user state 
    // user - will be object with attributes of loading, error and userInfo
    const user = useSelector((state) => state.user);
    // Get the userInfo piece of state, dont need loading and error 
    const {userInfo} = user;    

    // scoreOutOf - This is used in the form for subbmitting a review, movies are scored out of 10, need 11 for looping through
    const scoreOutOf = 11;

    /// handleReviewSubmit ///
    // Description:
    //  This function handles the submission of form to create a review
    // Inputs:
    //  event - The button event, 
    const handleReviewSubmit = async(event) =>{
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
            url: `${process.env.REACT_APP_API_URL}/movies/reviews/${movieId}`,
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
        await axios(requestConfig);
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

    /// Return ///
    // reviewError = True - Show an error message on why the review could not be posted 
    // reviewMessage = True - Show a success message to tell the user their review has been posted 
    // reviewLoading = True - Show to the user their review is being processed 
    // Returns a card with an input form for a review headline, score and comments 
    return(
        <Card className="pb-4"> 
            {reviewError && <MessageAlert variant='danger'>{reviewError}</MessageAlert>}  
            {reviewMessage && <MessageAlert variant='success'>{reviewMessage}</MessageAlert>} 
            {reviewLoading && <LoadingSpinner/>}
            <Card.Body> 
                <Card.Title>Create a review</Card.Title>
                <Form onSubmit={handleReviewSubmit} className="pb-4">
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
                                      setScore(i)}
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
    )
}

export default AddReview;