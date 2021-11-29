// Description:
//  This component is used to display a users movies they have liked in there profile 


/// Imports ///
// Table - Movies are hel within a table
import {Table} from "react-bootstrap";

/// MyMovies ///
// Descrption:
//  Container component which displays the movies of a user 
function MyMovies () {
    return(
        <Table>
            <thead>
                <th>Title</th>
                <th>Director</th>
                <th>Release Date</th>
                <th>Cast</th>
            </thead>
            <tbody>
                <tr>
                    <td>Pulp Fiction</td>
                    <td>Quentin Tartino</td>
                    <td></td>
                </tr>
            </tbody>
        </Table>
        )
}

export default FormContainer;