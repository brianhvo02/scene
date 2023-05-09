import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SelectGenresForm.scss';
import { signup, useProtected, useRequireLoggedOut } from '../../store/session';
import { clearSessionErrors, useClearSessionErrors } from '../../store/errors/sessionErrors';
import { fetchGenres, useGenres } from '../../store/genres';
import { fetchPopularMovies, receiveMovies } from '../../store/movies';

const SelectGenresForm = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState({});
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGenres());
    }, []);

    useProtected();
    useClearSessionErrors();

    const allGenres = useGenres();
    
    const fetchedPopular = useRef(false);
    useEffect(() => {
        if (allGenres.length && !fetchedPopular.current) {
            dispatch(fetchPopularMovies())
                .then(({ movies }) => {
                    const popular = Object.values(movies);
                    const genres = [];
                    const usedMovies = [];
                    allGenres.forEach(genre => {
                        const movie = popular.find(movie => movie.genreIds.includes(genre.id) && !usedMovies.includes(movie.id));
                        movie && usedMovies.push(movie.id);
                        genres.push({
                            ...genre,
                            posterPath: movie?.posterPath
                        });
                    });
                    setGenres(genres);
                });
            fetchedPopular.current = true;
        }
    }, [allGenres]);

    const POSTER_LINK = "https://image.tmdb.org/t/p/original";

    return (
        <div className='select-genres-container'>
            {
                genres.map(genre => 
                    <div className='select-genre'>
                        <label key={genre.id} >
                            <input type='checkbox' value={genre.id} onChange={e => console.log(e.target.checked) }/>
                            <img src={genre.posterPath ? POSTER_LINK + genre.posterPath : '/logo.png'} />
                            <p>{genre.name}</p>
                        </label>
                    </div>
                )
            }
        </div>
    )
}

export default SelectGenresForm;