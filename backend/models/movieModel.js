// Description: 
//  Contains the model for the movie collection in the database, 
//  This defines the schema for interacting with the database 

/// Imports ///
//  mongoose - Object data mapper library for mongodb 
import mongoose from 'mongoose';

// userSchema
//  Description:
//      This is the schema for the user collection in the mongodb database 
//  Fields:
//      firstName(string,required)              - The users first name  
//      secondName(string,required)             - The users secondname 
//      email(string,required,unique)           - Email address for the user   
//      password(string,required)               - Users password to login 
//      isAdmin(Boolean,required,default false) - Used for detecting admin of the site, 
const movieSchema = mongoose.Schema({
    original_title: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    duration: {
        type: Number,
        required: true, 
    },
    country: {
        type: [String],
        required: true 
    },
    language: {
        type: [String],
        required: true 
    },
    director: {
        type: String,
        required: true 
    },
    writer: {
        type: String,
        required: true 
    },
    production_company: {
        type: String,
        required: true 
    },
    cast: {
        type: [String],
        required: true 
    },
    description: {
        type: String,
        required: true 
    },
    usa_gross_income: {
        type: Number
    },
    worldwide_gross_income: {
        type: Number,
        required: true 
    },
    reviews:[
        {
            reviewer:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
            headline:{type:String,required:true},
            comments:{type:String,required:true},
            score:{type:Number,required:true},
            createdAt:{type:Date,required:true}
        }
    ]

},{
    timestamps: true
}
);


// User - This is the database model created using the defined schema 
const Movie = mongoose.model('Movie',movieSchema);

export default Movie;