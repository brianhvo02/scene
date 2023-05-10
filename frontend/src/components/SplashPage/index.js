import { useEffect, useState } from 'react'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchNowPlayingMovies, getMovies } from '../../store/movies';
import { shuffle } from '../../util/function';
import MoviePolaroid from './MoviePolaroid';
import { Slogan } from './SplashSlogan';
import { createPortal } from 'react-dom';
import SignupForm from '../SessionForms/SignupForm';
import LoginForm from '../SessionForms/LoginForm';
import SelectGenresForm from '../SessionForms/SelectGenresForm';
import { useRequireLoggedOut } from '../../store/session';
import Modal from '../Modal';

const SplashPage = () => {
    const dispatch = useDispatch();
    const movies = useSelector(getMovies);
    const [moviePolaroids, setMoviePolaroids] = useState(shuffle(movies).slice(0,14))
    const tmdbUrl = "https://www.themoviedb.org/t/p/original";
    const [sloganPage, setSloganPage] = useState(0);
    const [fadeIn, setFadeIn] = useState(false)
    const [modal, setModal] = useState();

    useRequireLoggedOut(() => setModal('genres'));

    useEffect(()=>{
        dispatch(fetchNowPlayingMovies());
    }, [dispatch]);

    useEffect(()=> {
        setMoviePolaroids(shuffle(movies).slice(0, 14))
        setSloganPage(0)
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(()=>{
                setMoviePolaroids(shuffle(movies).slice(0, 14));
                setSloganPage((prev) => (prev + 1) % 3);
                setFadeIn(true);
            }, 800);
        }, 8000);
        return () => {
            clearInterval(interval);
        }
    },[movies]);

    return (
        <div className="splash-page-container">
            {
                modal &&
                    createPortal(
                        <Modal closeModal = {()=>setModal('')}>
                            {modal === 'signup' && <SignupForm />}
                            {modal === 'login' && <LoginForm />}
                            {modal === 'genres' && <SelectGenresForm />}
                            
                        </Modal>, 
                        document.body
                    )
            }
            <div className='splash-center-container'>
                <div className='scene-login-signup-logo'>
                    <img className="scene-logo" src='/light-logo.png' alt="scene-logo" />                      
                    <div className='scene-login-signup-logo-right'>
                        <div className='slogan-text' style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s" }}>{Slogan[sloganPage]}</div>
                        <div className="button-container">
                            <button onClick={() => setModal('signup')}>Sign Up</button>
                            <button onClick={() => setModal('login')}>Login</button>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className='splash-movie-poster-box'>
                <div className='splash-movie-poster-container'>
                {
                    moviePolaroids.map((movie, i) => 
                    <MoviePolaroid
                        imageUrl = {`${tmdbUrl.concat(movie.posterPath)}`}
                        title = {movie.title}
                        key = {i}
                        posterId = {i}
                        fadeIn = {fadeIn}
                    />)
                }
                </div>
            </div>
        </div>
    )
}

export default SplashPage;