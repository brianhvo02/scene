import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SelectGenresForm.scss';
import { signup, useProtected, useRequireLoggedOut } from '../../store/session';
import { clearSessionErrors, useClearSessionErrors } from '../../store/errors/sessionErrors';
import { fetchGenres, useGenres } from '../../store/genres';
import { fetchPopularMovies, receiveMovies } from '../../store/movies';

const SelectGenresForm = () => {
    const [selectedGenres, setSelectedGenres] = useState({});
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGenres());
    }, []);

    useProtected();
    useClearSessionErrors();

    const genres = useGenres();

    return (
        <div className='select-genres-container'>
            {
                genres.map(genre => 
                    <p>{genre}</p>
                )
            }
        </div>
    )
}

export default SelectGenresForm;