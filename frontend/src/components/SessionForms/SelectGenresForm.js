import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SelectGenresForm.scss';
import { signup, updateGenreZipCode, useProtected, useRequireLoggedOut } from '../../store/session';
import { clearSessionErrors, receiveSessionErrors, useClearSessionErrors } from '../../store/errors/sessionErrors';
import { fetchGenres, useGenres } from '../../store/genres';
import { fetchPopularMovies, receiveMovies } from '../../store/movies';
import _ from 'lodash';

const geocodeAddress = async (address, apiKey) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
    const data = await response.json();
    const { lat, lng } = data.results[0].geometry.location;
    // const latitude = lat;
    // const longitude = lng;
    return {latitude: lat, longitude: lng};
};

const SelectGenresForm = () => {
    const [selectedGenres, setSelectedGenres] = useState({});
    const [zipCode, setZipCode] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGenres());
    }, []);

    useProtected();
    console.log(errors)
    useClearSessionErrors();

    const genres = useGenres();

    const handleSubmit = () => {
        const genreIds = Object.keys(selectedGenres).filter(key => selectedGenres[key]);

        const errors = [];
        if (genreIds.length === 0) errors.push('Please select at least one genre');
        if (genreIds.length > 3) errors.push('Please select at most three genres');
        if (zipCode.length !== 5) errors.push('Please enter a valid zip code');


        if (errors?.length) {
            dispatch(receiveSessionErrors({ errors }));
        } else {
            geocodeAddress(zipCode, process.env.REACT_APP_GOOGLE_MAPS_API_KEY).then(coordinates => dispatch(updateGenreZipCode(genreIds, zipCode, coordinates)));
        }
    }



    return (
        <div className='select-genres-container'>
            <div><h1>Just a few more steps to go</h1></div>
            <div className='zip-genres-box'>
                <label className='input-label' htmlFor='zip-code-input'>Enter your zip code:</label>
                <div className='inputbox-container'>
                    <input id="zip-code-input" value={zipCode} 
                    placeholder='your zip code'
                    onChange={
                        e => 
                        (
                            e.target.value.match(/^[0-9]+$/) 
                            ||
                            e.target.value.length === 0
                            ) 
                            && e.target.value.length <= 5 
                            && setZipCode(e.target.value)
                        } />
                </div>

                <label className='input-label'>Choose at least one and up to three genres:</label>             
                {
                    ( _.isArray(errors) ? errors : Object.values(errors) ).map((error, i) => 
                        <p key={`error_${i}`}>{error}</p>
                    )
                }
                
                <div className='select-genres-grid'>
                    {
                        genres.sort((a, b) => a.name.localeCompare(b.name)).map(genre => 
                            <label className={`genre-category-${selectedGenres[genre.id] ? 'check' : 'uncheck'}`} key={genre.id} > 
                            
                                <input className='genre-category' type='checkbox' value={genre.id} 
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

                <button className='modal-button-genres' onClick={handleSubmit}>Complete registration</button>
            </div>
            
        </div>
    )
}

export default SelectGenresForm;