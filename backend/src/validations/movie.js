import { check } from "express-validator";
import handleValidationErrors from "./handleValidationErrors";

const validateMovieInput = [
    check('tmdbId')
        .exists({ checkFalsy: true })
        .withMessage("Please provide a tmdb id for your movie."),
    check('title')
        .exists({ checkFalsy: true })
        .withMessage("Please provide a title for your movie."),
    check('overview')
        .exists({ checkFalsy: true })
        .withMessage("Please provide an overview for your movie."),
    check('posterPath')
        .exists({ checkFalsy: true })
        .withMessage("Please provide a poster path for your movie."),
    check('backdropPath')
        .exists({ checkFalsy: true })
        .withMessage("Please provide a backdrop path for your movie."),
    check('genreIds')
        .exists({ checkFalsy: true })
        .withMessage("Please provide genre ids for your movie."),
    handleValidationErrors
]

export default validateMovieInput;