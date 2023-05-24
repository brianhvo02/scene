import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRating, deleteRating, updateRating } from '../../store/movies'
import { GiPopcorn } from 'react-icons/gi';
import PopcornRating from './PopcornRating';
import './index.scss';

const RatingsComponent = ({ movie }) => {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [ratingsValue, setRatingsValue] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [completedRating, setCompletedRating] = useState(false);

    useEffect(() => {
        movie?.ratings?.map(rating => {
            if(rating.rater._id === sessionUser?._id) {
                setUserRating(rating);
                setRatingsValue(rating.rating);
            } 
        })
    },[movie])


    const handleRatingSubmit = (e) => {
        e.preventDefault();

        const newRating = {
            rating: ratingsValue,
            rater: sessionUser
        };

        if(userRating){
            newRating._id = userRating._id;
            dispatch(updateRating(newRating, movie._id))
                .then(()=> setCompletedRating(true));
        } else {
            dispatch(addRating(newRating, movie._id))
            .then(()=> setCompletedRating(true));
        }
    }

    const onChange = (number) => {
        setRatingsValue(parseInt(number));
    }


    return(
        <div className='ratings-container'>
            <div className="user-ratings">
                <h3>Ratings: </h3>
                <form className="rating-form" onSubmit={handleRatingSubmit}>
                    <PopcornRating disabled={false} onChange={onChange} ratingsValue={ratingsValue}/>
                    <button className="submit-rating-button">{userRating ? "Update Rating" : "Submit Rating"}</button>
                </form>
                {completedRating ? <p>Your rating has been saved!</p> : null}
            </div>
        </div>
    )
}

export default RatingsComponent;