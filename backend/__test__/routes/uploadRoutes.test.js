/// Descrption:
//  Used to test thr route for uploaing a photo to the backend 
/// Imports ///
// request     - From the supertest mosudle, used to send http request in testing environment 
// express     - The backend API framework 
import { TestWatcher } from '@jest/core';
import {postProfileImage} from '../../controllers/uploadController.js';
import User from '../../models/userModel.js'

describe("POST /uploads/profileimage", () =>{
    let req;
    let res;
    let next;
    beforeEach(() =>{
        // Req
        req = {};
        req.user = {};
        req.user._id = 1;
        req.file = {}
        // Res
        res = {};
        res.status = jest.fn()
        res.status.mockReturnValue(res)
        res.json = jest.fn();
        // Next
        next = jest.fn();
        // Database
        User.findOneAndUpdate = jest.fn();
        User.findOneAndUpdate.mockReturnValue("Fake_User");
    })
    // Correct data sent 
    describe("Correct data sent to route", () => {
        // User uploading a new profile picture and changing defuault 
        test("Should return 200, change the reference for this user from default picture", async () =>{
            // Arrange
            let profileImage = "NewImage.jpg"
            req.user.profileImage = "default_profile_image.jpg";
            req.file.originalname = profileImage;
            res.json.mockImplementation(() =>{return 200});
            // Act
            let response = await postProfileImage(req,res,next);
            // Assert
            expect(response).toBe(200);
            expect(User.findOneAndUpdate.mock.calls.length).toBe(1);
        })
        // User changing custom profile picture 
        test("Should return 200, new image uploaded but no need to change reference old image overidden", async () =>{
            // Arrange
            let profileImage = "NewImage.jpg"
            req.user.profileImage = "not_default_profile_image.jpg";
            req.file.originalname = profileImage;
            res.json.mockImplementation(() =>{return 200});
            // Act
            let response = await postProfileImage(req,res,next);
            // Assert
            expect(response).toBe(200);
            expect(User.findOneAndUpdate.mock.calls.length).toBe(0);
        })
    })
    // Incorrect data sent 
    describe("Datbase error",() =>{
        // Database error
        test("Should be 500, database throws error", async () =>{
            // Arrange
            let profileImage = "NewImage.jpg"
            req.user.profileImage = "default_profile_image.jpg";
            req.file.originalname = profileImage;
            User.findOneAndUpdate.mockImplementation(() =>{throw new Error("Database error")});
            next.mockReturnValue(res);
            // Act
            let response = await postProfileImage(req,res,next);
            // Assert
            expect(response.errormessage).toBe("Profile image could not be updated at this time");
            expect(next.mock.calls.length).toBe(1);
        })
    })

})



