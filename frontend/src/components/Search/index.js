import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchSearchedMovies } from "../../store/movies";
import { getMovies } from '../../store/movies';
import SearchMovieCard from './SearchMovieCard';

const SearchShow = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([])

    useEffect(() => {
        dispatch(fetchSearchedMovies(searchParams.get("query"))).then(({ movies }) => setMovies(Object.values(movies)));
    }, [dispatch, searchParams])
    

    return(
        <>
        {movies.map( movie => 
            <SearchMovieCard key={movie.id} movie={movie}/>
        )}
        </>
    )
}

export default SearchShow;