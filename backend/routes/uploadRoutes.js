/// Description:
//  This file holds all the route definitions for the /upload API routes 

/// Imports ///
// express          - The express JS module for the server, required to get router object 
// protectedRoute   - This middleware ensures a user is signed in 
// multer           - Third party package for managing uploads of files 
// path             - Used in handling file/os paths 
import express from 'express';
import { protectdRoute } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import {postProfileImage} from '../controllers/uploadController.js'

/// Variables ///
//  router - The router object attahced to the express server, used to define routes for the api 
const router = express.Router();

/// Config Multer ///
// Multer acts as a middleware and can be configured below to set a 
// destination for files to be saved along with a file naming convention 

/// storage ///
// Images will be stored on disc, the destination of where the files are stored 
// and the naming convention is set in the two functions defined below 
const storage = multer.diskStorage({
    // Set how desitnation is deteremined 
    destination: function (req,file,cb){
        let uploadDir = path.join(path.resolve(),'/uploads/profileImages')
        cb(null,uploadDir);
    },
    // Set the naming convention 
    // Want a naming convention which uses the users ID which is sent with request 
    // We have the user object in the req.user object 
    // profileImage-<USER_ID><FILE_EXTENSION>
    filename: function (req,file,cb){
        cb(null,`profileImage-${req.user._id}${path.extname(file.originalname)}`)
    }
})

/// checkTypes ///
// Description:
//  This function is used to check the file type which has been uploaded 
//  Only images should be able to be uploaded (jpg,jpeg,png)
function checkTypes(req,file,cb){
    // Only files allowed are jpg, jpeg or png 
    let fileType  = path.extname(file.originalname).toLowerCase();
    // File in correct format  
    if(fileType == '.jpg' || fileType == '.jpeg' || fileType == '.png'){
        // File in correct format, continue with the upload 
        return cb(null, true);
    }else{
        // Cancel the upload, response will be caught by errorHandling middleware in errorMiddleware.js
        return cb(new Error("Profile picture format incorrect, jpg, gpeg or png only accepted"))
    }
};

/// upload ///
// Description:
//  This is the definition of the actual multer midddle ware, it contains the functions defined above    
const upload = multer({
    // storage - Defines how and where file is saved, storage is a function defined above  
    storage: storage,
    // fileFilter - We only want jpg, jpeg and png files 
    fileFilter: function(req,file,cb){
        checkTypes(req,file,cb);
    }
})


/// POST /uploads/profileImage ///
// Description:
//  Route for uploading a profile image, the profile image by default is stock photo   
// Access Control:
//  Private Route
router.post('/profileimage',protectdRoute,upload.single('file'),postProfileImage)

export default router;