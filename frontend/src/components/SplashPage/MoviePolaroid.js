import React, { useEffect, useState } from 'react'


const MoviePolaroid = (props) => {
    const { title, imageUrl, posterId} = props
   
    return (
        <div className={`splash-movie-polaroid-container-${posterId}`}>
            <div className={'splash-photo-container'}>
                <div className={'splash-individual-photo'}>
                    <img className={`splash-poster`} src={imageUrl} alt="" />
                    <div className="movie-title">{title}</div>
                </div>  
            </div>
        </div>
    )
}

export default MoviePolaroid