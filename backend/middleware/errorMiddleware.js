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
    /// Set the status code, sometimes you get a 200 even though you shsouldnt 
    if(res.statusCode === 200){
        statusCode = 500
    }else{
        statusCode = res.statusCode;
    }
    // Set the status code for the response 
    res.status(statusCode);
    // If we are in production just return message 
    if(process.env.NODE_ENV === 'production'){
        res.json({
            message: err.message
    })
    }else{
        res.json({
            message: err.message,
            trace: err.stack
    })
    }  
}

export {errorHandler};