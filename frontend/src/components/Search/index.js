import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { fetchSearchedMovies } from "../../store/movies";
import { getMovies } from '../../store/movies';
import SearchMovieCard from './SearchMovieCard';

const SearchShow = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([])
    const [totalPages, setTotalPages] = useState(null)
    const page = useMemo(() => searchParams.get("page") || 1, [searchParams])

    useEffect(() => {
        dispatch(fetchSearchedMovies(searchParams.get("query"), page))
            .then(({ movies, totalPages }) => {
                setMovies(Object.values(movies))
                setTotalPages(totalPages)
            });
            
            
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