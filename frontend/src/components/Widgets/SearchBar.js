/// Description:
//  This file holds the component for the search bar 
//  The search bar is embeded into the header of the website 
//  A user selects the type of search movie name, actor etc and then enters a keyword into the search box 

/// Imports ///
// useState    - Stateful component, https://reactjs.org/docs/hooks-state.html
// useNavigate - Used to redirect once search button is clicked  
import {useState} from 'react';
import { useNavigate} from "react-router-dom";

// Bootstrap ///
import {Button,FormControl,InputGroup,Dropdown,DropdownButton} from "react-bootstrap";


/// SearchBar ///
// Description:
//  This search bar component is embded into the header 
//  It allows the user to select the category they want to search under and enter a keyword 
//  There are string categorys and number categorys 
function SearchBar() {
    /// State ///
    // category        - The category the search is for 
    // keyword         - The keyword to search for in the category 
    // displayCategory - The category selection to display to user, database names not as nice
    // inputType       - Used for the input type for the search box will either be text or number   
    const [category, setCategory] = useState("original_title");
    const [keyword, setKeyword]   = useState("");
    const [displayCategory,setDisplayCategory] = useState("Title");
    const [inputType, setInputType] = useState("text")


    // navigate - It is a function that lets you naviagte programitically for redircts
    const navigate = useNavigate();

    /// handlerSubmit ///
    // Description:
    //  This function is called when a user hits the search button 
    //  It will redirect the user to /search/0/<CATEGORY>/<KEYWORD>
    //  This url renders the home screen component but the Category and keyword will be 
    //  used to get the movies from the database 
    function handleSubmit(event) {
        event.preventDefault();
        // If no key word has been filled in just redirect to the normal home page 
        if(keyword === ""){
            // Navigate to home page nothing entered just show normal results  
            navigate('/');
        }else{
            // keyword and category inputted navigate to /search/:category/:keyword
            navigate(`/search/0/${category}/${keyword}`)
        }
    }

    /// return ///
    // Return an input group with a dropdown menu for the category to search and 
    // an input field for the keyword input 
    return(
        <InputGroup className="px-2">
            <DropdownButton
                className="min-vw-25 mw-25"
                variant="secondary"
                title={displayCategory}
        >
        <Dropdown.Item 
            onClick = {(e) =>{
                e.preventDefault();
                setDisplayCategory("Title");
                setInputType("text");
                setCategory("original_title");
            }}>
            Title
        </Dropdown.Item> 
        <Dropdown.Item 
            onClick = {(e) =>{
                e.preventDefault();
                setDisplayCategory("Director");
                setInputType("text");
                setCategory("director")
            }}>
            Director
        </Dropdown.Item>
        <Dropdown.Item 
            onClick = {(e) =>{
                e.preventDefault();
                setDisplayCategory("Actor");
                setInputType("text");
                setCategory("cast")
            }}>
            Actor
        </Dropdown.Item>
          <Dropdown.Item 
            onClick = {(e) =>{
                e.preventDefault();
                setDisplayCategory("Genre");
                setInputType("text");
                setCategory("genre")
            }}>
            Genre
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item 
            onClick = {(e) =>{
                e.preventDefault();
                setDisplayCategory("Year");
                setInputType("number");
                setCategory("year")
            }}>
            Year
        </Dropdown.Item>
        <Dropdown.Item 
            onClick = {(e) =>{
                e.preventDefault();
                setDisplayCategory("Runtime");
                setInputType("number");
                setCategory("duration")
            }}>
            Runtime
        </Dropdown.Item>
        </DropdownButton>
        <FormControl
            type={inputType}
            onChange={(event) => setKeyword(event.target.value)}
        ></FormControl>
        <Button
            onClick={handleSubmit}
            variant="secondary"
        >Search</Button>
        </InputGroup>
    )


};

export default SearchBar;