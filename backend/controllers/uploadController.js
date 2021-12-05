/// Description:
//  Controller for the user routes defined in /routes/uploadRoutes.js


/// Imports ///
// User   - Object model for the user collection 
// path   - Used for getting file extension on upload
import User from '../models/userModel.js';
import path from 'path';
import { copyFileSync } from 'fs';

// Set the __dirname, using modules syntax so not available by efault 
const __dirname = path.resolve(); 

/// postProfileImage ///
// Description:
//  This function handles the updating of a profile image in the database
//  The actual image is stored in the folder uploads/profileImages but a reference is stored in the database 
// Route:
//  POST /uploads/profileImage
// Access Control:
//  Private Route 
async function postProfileImage(req,res,next) {
    try{
        // Check if the reference is the default reference, if so we need to update the reference
        // note the default reference is set in the userModel.js file 
        if(req.user.profileImage === "default_profile_image.jpg"){
            // Filter by _id, update the profileImage
            let filter = {_id: req.user._id};
            let update = {profileImage: `profileImage-${req.user._id}${path.extname(req.file.originalname)}`}
            let existingUser = await User.findOneAndUpdate(filter, update,{new: true});
            //Return and refrence to location of new file, this is not the actual file returned 
            return res.status(200).json({_id:existingUser._id,profileImage:existingUser.profileImage});
        }else{
            // No need to update the reference, the photo in the file has been overwrited, same name
            return res.status(200).json({_id:req.user._id,profileImage:req.user.profileImage});
        }
    }catch(error){
        // If this block is reached then there is a server error 
        console.error(error);
        res.errormessage = "Profile image could not be updated at this time"
        res.status(500);
        return next(error); 
    }
}


export {postProfileImage}