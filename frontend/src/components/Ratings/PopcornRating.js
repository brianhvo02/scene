import { useEffect, useState } from 'react';
import { GiPopcorn } from 'react-icons/gi'
import './index.scss';

const PopcornRating = ({ ratingsValue, disabled, onChange }) => {
    const [activeRating, setActiveRating] = useState(ratingsValue);

    useEffect(() => {
        setActiveRating(ratingsValue)
    },[ratingsValue])

    return(
        <div className="rating-inputs">
            <div
                className={activeRating >= 1 ? "filled" : " empty"}
                onMouseEnter={() => {if(!disabled) setActiveRating(1)}}
                onMouseLeave={() => {if(!disabled) setActiveRating(ratingsValue)}}
                onClick={() => {if(!disabled) onChange(1)}}
            >
                <GiPopcorn />
            </div>
            <div
                className={activeRating >= 2 ? "filled" : " empty"}
                onMouseEnter={() => {if(!disabled) setActiveRating(2)}}
                onMouseLeave={() => {if(!disabled) setActiveRating(ratingsValue)}}
                onClick={() => {if(!disabled) onChange(2)}}
            >
                <GiPopcorn />
            </div>
            <div
                className={activeRating >= 3 ? "filled" : " empty"}
                onMouseEnter={() => {if(!disabled) setActiveRating(3)}}
                onMouseLeave={() => {if(!disabled) setActiveRating(ratingsValue)}}
                onClick={() => {if(!disabled) onChange(3)}}
            >
                <GiPopcorn />
            </div>
            <div
                className={activeRating >= 4 ? "filled" : " empty"}
                onMouseEnter={() => {if(!disabled) setActiveRating(4)}}
                onMouseLeave={() => {if(!disabled) setActiveRating(ratingsValue)}}
                onClick={() => {if(!disabled) onChange(4)}}
            >
                <GiPopcorn />
            </div>
            <div
                className={activeRating >= 5 ? "filled" : " empty"}
                onMouseEnter={() => {if(!disabled) setActiveRating(5)}}
                onMouseLeave={() => {if(!disabled) setActiveRating(ratingsValue)}}
                onClick={() => {if(!disabled) onChange(5)}}
            >
                <GiPopcorn />
            </div>
        </div>
    )
}

export default PopcornRating;