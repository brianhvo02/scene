import { useEffect, useState } from 'react'
import './index.scss'
import { useDispatch } from 'react-redux'

const SplashPage = () => {
    const dispatch = useDispatch();
    
    useEffect(()=>{
        
    },[])
    const movies = []
    return(
        <>
        <div className="name-logo-container">
            <img className="scene-logo" src="../../public/logo.png" alt="scene-logo" />
            <div className='splash-movie-poster-container'>
                {
                    movies.map((movie, i) => <moviePolaroid
                    imageUrls = {`https://www.themoviedb.org/t/p${movie.poster_path}`}
                    title = {movie.title}
                    key = {i}
                    />)
                }
            </div>
            <div className="button-container">
                <button>Signin Button</button>
                <button>Login Button</button>
            </div>
        </div>
        </>
    )
}

export default SplashPage;