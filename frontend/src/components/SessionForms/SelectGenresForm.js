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

    return (
        <div className='select-genres-container'>
            {
                
            }
        </div>
    )
}

export default SelectGenresForm;