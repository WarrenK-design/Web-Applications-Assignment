// Description:
//  This component should be used for any pages that load data 
//  While the data is loading we can display a spinner to the user to show that the component is loading 
//  These spinner are used with bootstrap https://react-bootstrap.github.io/components/spinners/

/// Bootstarp ///
// spinner - Spinners for loading screens see https://react-bootstrap.github.io/components/spinners/
import {Spinner} from 'react-bootstrap';

/// LoadingSpinner ///
// Description:
//  Uses the rect bootstrap spinner component to show a spinner during loading 
function LoadingSpinner(){
    return(
        <Spinner 
            animation='border' 
            variant = 'info'
            style={{width:'90px', height:'90px',margin:'auto', display:'block'}}> {/*The style incresases the size and centers the spinner*/}
        </Spinner>
    );
}

export default LoadingSpinner;