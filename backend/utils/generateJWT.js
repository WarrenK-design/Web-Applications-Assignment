/// Description:
//  This file stores all function associated with JSON webtokens
//  JSON webtokens are used in this application for granting access to resources 
//  A JWT is generated for each user when they login and verifys who they are when accesing certain resources 

/// Imports ///
//  jwt - Package for generating json web tokens 
import jwt from 'jsonwebtoken';


/// genJWT ///
// Description:
//  This function generates the JWT, the 
function genJWT(id) {
    // generate the token using the id, the secret key to hash it and set expiration time 
    let token = jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
    return token;
} 

export {genJWT};