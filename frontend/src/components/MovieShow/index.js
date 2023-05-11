import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie, getMovie } from '../../store/movies';
import EventCreateForm from '../EventCreateForm';
import './index.scss'
import { useEffect, useMemo } from 'react';

const MovieShow = () => {
    const { movieId } = useParams();
    const movie = useSelector(getMovie(movieId));
    const MOVIE_LINK = 'https://image.tmdb.org/t/p/original';
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMovie(movieId));
    }, [dispatch]);

    const Comment = ({ body, author, children }) => {
        return (
            <div className='comment'>
                <p>Body: {body}</p>
                <p>Author: {author.username}</p>
                <div className='children'>
                    {
                        children.map(child => <Comment key={child._id} body={child.body} author={child.author} children={child.childrenComments} />)
                    }
                </div>
            </div>
        )
    }

    const comments = useMemo(() => 
        movie?.comments?.map(comment =>
            <Comment key={comment._id} body={comment.body} author={comment.author} children={comment.childrenComments} />
        ), 
    [movie]);

    return (
        <>
            <img src={`${MOVIE_LINK.concat(movie?.backdropPath)}`} alt='' className='background-image'/>
            <div className='movie-info-container'>
                <div className='movie-info-left'>
                    <h2>{movie?.title}</h2>
                    <h3>Movie Description:</h3>
                    <p>{movie?.overview}</p>
                    <div className='movie-show-event-button'>
                        <EventCreateForm />
                    </div>
                    <div className='events-near'>
                        <h3>Events near you</h3>
                        {
                            movie?.events?.map(event =>
                                <Link key={event._id} to={`./event/${event._id}`}>{event.title}</Link>
                            )
                        }
                    </div>
                </div>
                <div className='movie-info-right'>
                    <img src={`${MOVIE_LINK.concat(movie?.posterPath)}`} alt=''/>
                </div>
            </div>
            <div className='background-gradient'></div>]
            <div className='comments'>
                {comments}
            </div>
        </>
    )
}

export default MovieShow;