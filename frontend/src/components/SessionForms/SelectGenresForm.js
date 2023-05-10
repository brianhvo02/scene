import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SelectGenresForm.scss';
import { signup, updateGenreZipCode, useProtected, useRequireLoggedOut } from '../../store/session';
import { clearSessionErrors, receiveSessionErrors, useClearSessionErrors } from '../../store/errors/sessionErrors';
import { fetchGenres, useGenres } from '../../store/genres';
import { fetchPopularMovies, receiveMovies } from '../../store/movies';

const SelectGenresForm = () => {
    const [selectedGenres, setSelectedGenres] = useState({});
    const [zipCode, setZipCode] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGenres());
    }, []);

    useProtected();
    useClearSessionErrors();

    const genres = useGenres();

    const handleSubmit = () => {
        const genreIds = Object.keys(selectedGenres).filter(key => selectedGenres[key]);

        const errors = [];
        if (genreIds.length === 0) errors.push('Please select at least one genre');
        if (genreIds.length > 3) errors.push('Please select at most three genres');
        if (zipCode.length !== 5) errors.push('Please enter a valid zip code');

        if (errors.length) {
            dispatch(receiveSessionErrors({ errors }));
        } else {
            dispatch(updateGenreZipCode(genreIds, zipCode));
        }
    }

    return (
        <div className='select-genres-container'>
            <h1>Choose at least one and up to three genres:</h1>
            {
                errors.map((error, i) => 
                    <p key={`error_${i}`}>{error}</p>
                )
            }
            <div className='select-genres-grid'>
                {
                    genres.sort((a, b) => a.name.localeCompare(b.name)).map(genre => 
                        <label key={genre.id} style={{
                            color: selectedGenres[genre.id] ? 'blue' : 'brown'
                        }}>
                            <input type='checkbox' value={genre.id} 
                                onChange={
                                    () => setSelectedGenres(prev => ({
                                        ...prev,
                                        [genre.id]: !prev[genre.id]
                                    }))
                                } 
                                checked={!!selectedGenres[genre.id]}
                            />
                            {genre.name}
                        </label>
                    )
                }
            </div>
            <label>
                Enter your zip code:
                <input value={zipCode} onChange={
                    e => 
                    (
                        e.target.value.match(/^[0-9]+$/) 
                        ||
                        e.target.value.length === 0
                        ) 
                        && e.target.value.length <= 5 
                        && setZipCode(e.target.value)
                    } />
            </label>
            <button className='modal-button' onClick={handleSubmit}>Complete registration</button>
        </div>
    )
}

export default SelectGenresForm;