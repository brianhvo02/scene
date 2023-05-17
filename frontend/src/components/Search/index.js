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
                    if( totalPages > 10 && parseInt(page) >= 10 && (parseInt(page) <= totalPages - 7)){
                        if( (i + 1).toString() === "1" ){
                            return (
                            <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                            )
                        } else if((i + 1).toString() === "2" ){
                            return (
                                <>
                                <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                <span>...</span>
                                </>
                                )
                        } 
                        else if ((i + 1).toString() === (totalPages).toString()) {
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        } else if( (i + 1).toString() === (totalPages - 1).toString()) {
                            return(
                                <>
                                    <span>...</span>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        } 
                        else if ((i + 1).toString() === (parseInt(page) - 3).toString() || (i + 1).toString() === (parseInt(page) - 2).toString() || (i + 1).toString() === (parseInt(page) - 1).toString() || (i + 1).toString() === (parseInt(page) + 1).toString() || (i + 1).toString() === (parseInt(page) + 2).toString() || (i + 1).toString() === (parseInt(page) + 3).toString() || (i + 1).toString() === page) {
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        }
                    } else if (totalPages > 10 && parseInt(page) < 10 && !(parseInt(page) >= totalPages - 7)) {
                        if( (i + 1) <= 10 ){
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        } else if ((i + 1).toString() === (totalPages).toString()) {
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        } else if( (i + 1).toString() === (totalPages - 1).toString()) {
                            return(
                                <>
                                    <span>...</span>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        } 
                    } else if (totalPages > 10 && parseInt(page) >= totalPages - 7) {
                        if ((i + 1).toString() === "1"){
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                                )
                        } else if ((i + 1).toString() === "2"){
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                    <span>...</span>
                                </>
                            )
                        } else if( (i + 1) >= totalPages - 7){
                            return(
                                <>
                                    <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                </>
                            )
                        }
                    } 
                    else {
                        return(
                            <>
                                <a key= {`page-${i}`} onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                            </>
                        )
                    }
                })}
                </div>
            </div>
            
        </>

    )
}

export default SearchShow;