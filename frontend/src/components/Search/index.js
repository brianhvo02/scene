import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { fetchSearchedMovies } from "../../store/movies";
import { getMovies } from '../../store/movies';
import SearchMovieCard from './SearchMovieCard';
import "./index.scss"
import Loading from '../Loading/Loading';
const SearchShow = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const page = useMemo(() => searchParams.get("page") || "1", [searchParams]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        dispatch(fetchSearchedMovies(searchParams.get("query"), page))
            .then(({ movies, totalPages }) => {
                setMovies(Object.values(movies))
                setTotalPages(totalPages);
                setLoading(false);
            });
    }, [dispatch, searchParams])

    if (loading) return <Loading />;
    return (
        <> 
            <div className='movie-search-card-container'>
                {
                    movies.length === 0 &&
                    <h1>No movies found!</h1>
                }
                {
                    movies.map( movie => 
                        <SearchMovieCard key={movie.id} movie={movie}/>
                    )
                }
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
                                        <div key= {`page-${i}`}>
                                            <a onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                            <span>...</span>
                                        </div>
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
                                        <div key= {`page-${i}`}>
                                            <span>...</span>
                                            <a onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                        </div>
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
                                        <div key={`page-${i}`}>
                                            <span>...</span>
                                            <a onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                        </div>
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
                                        <div key={`page-${i}`}>
                                            <a onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: i + 1})} className={`page-count-${page === (i + 1).toString() ? "active" : "not-active"}`}>{i + 1}</a>
                                            <span>...</span>
                                        </div>
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
                        })
                    }
                </div>
            </div>
            
        </>

    )
}

export default SearchShow;