/// Description:
///     The purpose of this file is to hold the users which are seeded to the database 
///     These users will be created automatically to generate a few first initial users to be used 

/// Imports ///
//  bcrypt - Used for hashing the passowrds of the users so they are not stored as plain text 
import bcrypt from 'bcryptjs';

/// users ///
// Description:
//  List of user objects to be inserted into the datbase 
// Fields:
//      firstName(string,required)              - The users first name  
//      secondName(string,required)             - The users secondname 
//      email(string,required,unique)           - Email address for the user   
//      password(string,required)               - Users password to login, encrypted using bcrypt and 10 rounds of hashing  
//      isAdmin(Boolean,required,default false) - Used for detecting admin of the site, 
const usersData = [
    {
        firstName: 'Warren',
        secondName: 'Kavanagh',
        email: 'WarrenKavanagh123@test.com',
        password: bcrypt.hashSync('abc123ABC',10),
        isAdmin:true
    },
    {
        firstName: 'Joe',
        secondName: 'Blogs',
        email: 'JoeBlogs123@test.com',
        password: bcrypt.hashSync('abc123ABC',10),
    },
    {
        firstName: 'Jane',
        secondName: 'Doe',
        email: 'JaneDoe123@test.com',
        password: bcrypt.hashSync('abc123ABC',10),
    }
];

export default usersData;