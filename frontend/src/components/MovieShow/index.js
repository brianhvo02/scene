import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, deleteComment, fetchMovie, getMovie } from '../../store/movies';
import EventCreateForm from '../EventCreateForm';
import { GiPopcorn } from 'react-icons/gi';
import './index.scss'
import { useEffect, useMemo, useState } from 'react';
import RatingsComponent from '../Ratings';

const MovieShow = () => {
    const currentUser = useSelector(state => state.session.user);
    const { movieId } = useParams();
    const movie = useSelector(getMovie(movieId));
    const MOVIE_LINK = 'https://image.tmdb.org/t/p/original';
    const dispatch = useDispatch();
    const [averageRating, setAverageRating] = useState(0)

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [])

    const [commentBody, setCommentBody] = useState('');
    const [activeComment, setActiveComment] = useState();

    useEffect(() => {
        dispatch(fetchMovie(movieId));
    }, [dispatch]);

    const openReply = () => {

    }

    useEffect(() => {
        let total = 0;
        if (movie?.ratings.length === 0) {
            return setAverageRating("No ratings yet");
        } else {
        movie?.ratings?.map(rating => {
            total += rating?.rating
        }) 
        setAverageRating((((Math.floor(total / movie?.ratings?.length))/ 5)) * 100)
        }
    }, [movie])

    const Comment = ({ id, body, author, children }) => {
        return (
            <div className='comment'>
                <div className='comment-body-box' onMouseEnter={() => setActiveComment(id)} onMouseLeave={() => setActiveComment()}>
                    <span>
                        <p className='comment-username'>{author.username}:</p>
                        <p className='comment-body'>{body}</p>
                    </span>
                    <span>
                        {
                            activeComment === id &&
                            <>
                                {
                                    author._id === currentUser._id &&
                                    <button className='event-create-button' 
                                        onClick={
                                            () => dispatch(deleteComment(id, movie.tmdbId))
                                        }>Remove</button>
                                }
                                <button className='event-create-button' 
                                    onClick={
                                        () => openReply()
                                    }>Reply</button>
                            </>
                        }
                    </span>
                </div>
                <div className='children'>
                    {
                        children.map(child => <Comment key={child._id} id={child._id} body={child.body} author={child.author} children={child.childrenComments} />)
                    }
                </div>
            </div>
        )
    }

    const comments = useMemo(() => 
        movie?.comments?.map(comment =>
            <Comment key={comment._id} id={comment._id} body={comment.body} author={comment.author} children={comment.childrenComments} />
        ), 
    [movie, activeComment]);

    return (
        <>
            <img src={movie ? `${MOVIE_LINK.concat(movie?.backdropPath)}` : ''} alt='' className='background-image'/>
            <div className='movie-info-container'>
                <div className='movie-info-left'>
                    <h2>{movie?.title}</h2>
                    <h3>Movie Description:</h3>
                    <p id="popcorn-score-container">Popcorn Score: <img src="/popcorn-svgrepo-com.svg" alt="popcorn svg"/> <span className="popcorn-score">{averageRating}%</span></p>
                    <p>{movie?.overview}</p>
                    <div className='movie-show-event-button'>
                        <EventCreateForm />
                    </div>
                    <div className='events-near'>
                        <h3>Events near you</h3>
                        <div className='events-card-box'>
                        {
                            movie?.events?.map(event =>
                                <Link className='event-show-box' key={event._id} to={`./event/${event._id}`}>
                                    <div className='event-show-title'>{event.title}</div>
                                    <div className='event-show-date'>{new Date(event.date).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</div>
                                    <div className='event-show-theater'>{event.theater}</div>
                                    {/* <div className='event-show-host'>{event.host.username}</div> */}
                                </Link>
                            )
                        }
                        </div>
                    </div>
                    <RatingsComponent movie={movie}/>
                </div>
                <div className='movie-info-right'>
                    <img src={movie ? `${MOVIE_LINK.concat(movie.posterPath)}` : ''} alt=''/>
                </div>
            </div>
            <div className='background-gradient'></div>
            <div className='comments-box'>
                <div className='comments'>
                    <div className='create-comment'>
                        <textarea className='comment comment-body' placeholder='Add a comment...' value={commentBody} onChange={e => setCommentBody(e.target.value)} />
                        {
                            commentBody &&
                            <>
                                <button className='event-create-button' onClick={() => setCommentBody('')}>Cancel</button>
                                <button className='event-create-button' 
                                    onClick={
                                        () => dispatch(createComment(commentBody, movie.tmdbId))
                                    }>Comment</button>
                            </>
                        }
                    </div>
                    {comments}
                </div>
            </div>
            
        </>
    )
}

export default MovieShow;