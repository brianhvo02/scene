import MoviePoster from "./MoviePoster"
import { getMovies, fetchDiscoverMovies } from "../../store/movies"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const DiscoverCarousel = () => {
    const dispatch = useDispatch();
    const movies = useSelector(getMovies)
}

export default DiscoverCarousel