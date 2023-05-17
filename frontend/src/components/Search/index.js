import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { fetchSearchedMovies } from "../../store/movies";
import { getMovies } from '../../store/movies';
import SearchMovieCard from './SearchMovieCard';
import "./index.scss"
const SearchShow = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const page = useMemo(() => searchParams.get("page") || "1", [searchParams]);

    useEffect(() => {
        dispatch(fetchSearchedMovies(searchParams.get("query"), page))
            .then(({ movies, totalPages }) => {
                setMovies(Object.values(movies))
                setTotalPages(totalPages)
            });
            
            
    }, [dispatch, searchParams])



    return(
        <> 
            <div className='movie-search-card-container'>
            {movies.map( movie => 
                <SearchMovieCard key={movie.id} movie={movie}/>
            )}
                <div className='page-count-container'>
                {        
                Array.from(Array(totalPages).keys()).map( i => {
                    return <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                })}
                </div>
            </div>
            
        </>
       
    )
}

export default SearchShow;