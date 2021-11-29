/// Description:
///     This is used to establish a connection to the database 
///     If a connection cannot be established the server process will be exited      

/// Imports ///
//  mongoose - Object modelling tool for mongodb 
import mongoose from 'mongoose';

async function mongoConnect() {
    // Try connect to the database, use connection string in env var
    try{
        // Connection attempt, log succesful message 
        const dbConnection = await mongoose.connect(process.env.MONGO_LOCAL_URI);
        console.log(`Connection to database at ${dbConnection.connection.host}`)
    }catch(error){
        // Could not connect to the database, log to console and exit process 
        console.error(`Error connection to mongodb database\nError:${error.message}`);
        // Exit with failure 
        process.exit(1);
    }
}

export default mongoConnect;