/// Description:
//  This file contains any error middleware functions for the server 
//  These are used to overwrite the default error middleware and send back custom messages 

/// errorHandler ///
//  Description:
//      This function is called to handle errors in the controllers for each route 
//      The err parameter is an error object which has a message attribute 
//      This message attribute is used to return a message from api to explain the error
//      The status code is set in the route to explain the error. 
//      When  
function errorHandler(err,req,res,next){
    let statusCode = null; 
    // Set the status code 
    // Check for incorrect file format message on profile picture, 
    // this is caught by external library but we want a 422 error not 500 
    if(err.message === "Profile picture format incorrect, jpg, gpeg or png only accepted"){
        res.errormessage = "Profile picture format incorrect, jpg, gpeg or png only accepted";
        statusCode = 422;
    }else if(res.statusCode === 200){///Sometimes you get a 200 even though you shouldnt
        statusCode = 500;
    }else{ // Correct status code must have been set in the route 
        statusCode = res.statusCode;
    }
    // Set the status code for the response 
    res.status(statusCode);
    // If we are in production just return message 
    if(process.env.NODE_ENV === 'production'){
        res.json({
            errormessage: res.errormessage
    })
    }else{
        res.json({
            errormessage: res.errormessage,
            tracemessage: err.message,
            trace: err.stack
    })
    }  
}

/// notFoundHandler ///
// Description:
//  This is used to catch any requests to URL's which do not exit
//  A status code for an unkown route should be a 404 status code 
function notFoundHandler(req,res,next){
    // Set the status code and a message  
    res.status(404);
    res.errormessage = "Could not find the requested route";
    return next(new Error("A request was mad to an unknown URL"));
}

export {errorHandler,notFoundHandler};