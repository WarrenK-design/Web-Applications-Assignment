/// Description:
//  This screen is used to display an individual movie navigated to by clicking a movie on the home screen
//  This is a dynamic route having the url /movie/:id

/// MovieScreen
// Description:
//  This component will display an individual movie on the webpage 
// Props:
//  match - Prop used to get the :id from the url https://v5.reactrouter.com/web/api/match
function MovieScreen({match}) {


    /// return ///
    return(
        <h1>Movie Screen</h1>
    );
}

export default MovieScreen;