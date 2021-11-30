/// Description:
//  This component is used on a movie screen to display the reviews associated with that movie 


import {Card, ListGroup} from "react-bootstrap";


/// Reviews ///
// Description:
//  Used to display the reviews associated with a movie on the movie page 
// Props:
//  reviews - An array of reviews associated with a gven film. Each item in the array has a reviewer, comments and score associated with it 
function Reviews({reviews}){
    if(reviews.length === 0){
        return(
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>No Reviews Yet</Card.Title>
                    <Card.Text>
                        No reviews have been posted for this film yet!
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }else{
        return(
        <>
            {reviews.map((review) =>(
            <Card key={review._id} className="mb-3">
                <Card.Body> 
                    <Card.Title>{review.headline}</Card.Title>
                    <Card.Subtitle className="mb-1 text-muted">{review.reviewer.firstName} {review.reviewer.secondName}</Card.Subtitle>
                    <Card.Subtitle className="mb-1 text-muted">{new Date(review.createdAt).toDateString()  }</Card.Subtitle>
                    <span>
                       {[...Array(review.score)].map((e,i) => <i style={{color:"yellow"}}key={i} className="fa fa-star px-1"/>)}
                        {[...Array(10-review.score)].map((e,i) => <i key={i} className="far fa-star px-1"/>)} 
                    </span>
                <Card.Text>
                    {review.comments}
                </Card.Text>
                </Card.Body>
            </Card>
        ))}
        </>
        );
    }
}
//
export default Reviews;