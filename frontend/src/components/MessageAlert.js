// Description:
//  This component is used to convey a message to the user 
//  This message is usually the reponse from the API requests 
//  For example "Password incorrect try again" from the /user/login route in the api 

/// Imports ///
// Alert - React bootstrap component used to display message, it is useful because we can control type of alert
//         with colours, i.e error=red, success=green, see https://react-bootstrap.github.io/components/alerts/
import {Alert} from 'react-bootstrap';


/// MessageAlert ///
// Description:
//  Used to alert the user of something using the Alert bootstrap component 
// Props:
//  variant  - This refers to the bootstrap variant, which controls the colour, see https://bootstrap-vue.org/docs/reference/color-variants
//  children - The children of this component, this will be the text to display, more info about using children https://reactjs.org/docs/composition-vs-inheritance.html 
function MessageAlert ({variant,children}) {
    // Set the variant and place the children inside to be displayed 
    return(
        <Alert variant={variant}>
            {children}
        </Alert>
    );
}

export default MessageAlert;