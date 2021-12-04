/// Description:
//  This component is used to handle when a user want to add or delete a movie 
//  From there myMovie list which there user is associated with 
//  As the movie list is also stored in redux, the list is updated using a action and reducer 

/// Imports ///
// useState  - Stateful component, https://reactjs.org/docs/hooks-state.html
// useEffect - After rendered to the DOM executes functionlaity, https://reactjs.org/docs/hooks-effect.html 
import {useState,useEffect} from 'react';


// Components //
// LoadingSpinner - Component to show a spinner when data is loading  
// MessageAlert   - This component is used to display messages to the user, in this case it will be displayed if an error occurs 
import LoadingSpinner from "../Widgets/LoadingSpinner";
import MessageAlert from "../Widgets/MessageAlert";

// Bootstrap ///
import {Button} from "react-bootstrap";

// Redux //
// Want to give the user an option to submit a review if they are logged in 
// useSelector     - Used to get the redux global state  https://react-redux.js.org/api/hooks
// updateMovieList - This action is used to update the movie list adding/deleting movies 
import {useSelector,useDispatch} from 'react-redux';
import {updateMovieList} from '../../actions/userActions';


// Props:
//  movieId - The movie id this add/delete button will be associated with 
function AddDeleteMyMovie({movieId}){
    /// State ///
    // loading - First set a loading state to determine if button needs to be set to add or delete 
    const [loading, setLoading]      = useState(true);
    const [inMyMovies,setInMyMovies] = useState(false);

    /// Redux ///
    // Description:
    //  Redux manages the global state, need to use that state for "user" and "userMovieList"
    //  user as wee need get access to there movieList associated with user object 
    //  userMovieList as we alter a users movie list in this component through a reducer 
    //  Get the user state and userMovieList state using useSelector
    //  state here is the entire redux state, we only want the user state 
    // user - will be object with attributes of loading, error and userInfo
    // userMovieList - Will be an object with attributes 
    const user = useSelector((state) => state.user);
    const userMovieList = useSelector((state) => state.userMovieList);
    // Get the userInfo piece of state, dont need loading and error 
    const {userInfo} = user;    
    // Get the error, loading and message piece of state, will be used to update the button 
    const {movieListMessage,movieListError} = userMovieList;
    // dispatch - Get reference to dispatch function from react-redux for dispatching actions 
    const dispatch = useDispatch();


    /// handleAddDeleteMyMovie ///
    // Description:
    //  This function handles when a user selects the add or delete movie button 
    //  Based upon the button selected a movie will either be added or deleted 
    // Inputs:
    //  method - Will be either POST (Add movie) or DELETE(Delete movie)
    function handleAddDeleteMyMovie(method){
      // Dispatch the updateMovieList action to update the movie list in the backend and redux
      dispatch(updateMovieList(method,movieId));
    }

    useEffect (() => {
        // Set Loading to true to show spinner
        setLoading(true);
        // Set in my movies to false until it is proven to be true 
        setInMyMovies(false);
        // Check if the movie now exist in userInfo myMovies, 
        userInfo.myMovies.forEach((movieObj) =>{
            // Checks if the id exists in the myMovies value 
            if(movieObj.movie._id === movieId){
                // It exists so set it true 
                setInMyMovies(true);
              }})
        setLoading(false);
    },[movieListMessage,userInfo.myMovies,movieId]) // Call use effect if movieListMessage changes, this is changed when a movie list is updated


    /// movieListError = True - Show the error to user, will be a message saying "Movie list could not be updated at this time"
    /// loading = True - Show the loading spinner 
    /// inMyMovies =True - A user has this movie in there list, show button to delete it from there list 
    /// inMyMovies = False - A user does not have this movie in there list, show add movie button 
    return(
    <>
        {movieListError && <MessageAlert variant="danger">{movieListError}</MessageAlert>}
        {loading ? (<LoadingSpinner/>)
            :
            inMyMovies ? (    
                <Button 
                onClick={(e) => {
                          e.preventDefault();
                          handleAddDeleteMyMovie("delete")
                        }
                        }
                variant="danger">Delete from My Movies</Button>
            )
            :
             <Button
                  onClick={(e) => {
                            e.preventDefault();
                            handleAddDeleteMyMovie("post")
                        }
                          }
                >Add To My Movies</Button>
        }
</>   
     )  
}

export default AddDeleteMyMovie;