import { useState } from "react"
import { useDispatch } from "react-redux"
import { RxMagnifyingGlass } from 'react-icons/rx';
import { fetchSearchedMovies } from "../../store/movies";
import { Navigate, useNavigate } from "react-router-dom";


const Search = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e) =>{
        e.preventDefault();
        dispatch(fetchSearchedMovies(query));
        navigate("/search")
    }


    const update = (e) => {
        e.preventDefault();
        setQuery(e.currentTarget.value)
    }

    return (
        <div className='search-bar'>
            <div className='search-bar-background'>
                <div className='magnifying-glass'><RxMagnifyingGlass id="mag-glass" /></div>
                <form className='search-input-box' onSubmit={handleSubmit}><input id='search-input' type="search" placeholder='Search' onChange={update} /></form>
            </div>
        </div>
    )
}

export default Search