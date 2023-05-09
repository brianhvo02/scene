import { useEffect, useState } from 'react'
import './index.scss'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(()=>{
        
    },[]);

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