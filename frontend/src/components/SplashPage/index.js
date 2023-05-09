import { useEffect, useState } from 'react'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchNowPlayingMovies, getMovies } from '../../store/movies';

const SplashPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const movies = useSelector(getMovies);
    const firstPageMovies = movies.slice(0,19);
    const secondPageMovies = movies.slice(20,39)
    const [moviePosters, setMoviePosters] = useState
    useEffect(()=>{
        dispatch(fetchNowPlayingMovies());
    },[dispatch]);

    return(
        <>
            <div className="name-logo-container">
                <img className="scene-logo" src='/logo.png' alt="scene-logo" />
                <div className='splash-movie-poster-container'>
                    {/* {
                        movies.map((movie, i) => <moviePolaroid
                        imageUrls = {`https://www.themoviedb.org/t/p${movie.poster_path}`}
                        title = {movie.title}
                        key = {i}
                        />)
                    } */}
                </div>
                <div className="button-container">
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                    <button onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </>
    )
}

export default SplashPage;