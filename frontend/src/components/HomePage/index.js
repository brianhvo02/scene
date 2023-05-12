import { useProtected } from '../../store/session';
import DiscoverCarousel from './DiscoverCarousel';
import RecommendationsPopup from './RecommendationsPopup';
import { useState } from 'react';
import './index.scss'
import { HiOutlineChevronDoubleDown } from 'react-icons/hi';

const HomePage = () => {
    const [selectedMovie, setSelectedMovie] = useState(); 
    
    return(
        <div className="homepage-container">
            <h2 className="homepage-heading">Discover New Movies</h2>
            <div className="discover-carousel">
                <DiscoverCarousel setSelectedMovie={setSelectedMovie}/>

            </div>
            {selectedMovie ? 
                <div className="arrow-bounce bounce">
                    <HiOutlineChevronDoubleDown className='arrow-bounce-down'/>
                   
                </div>
            : null
            }
            <div className="background-gradient"></div>
            <div className="recommendations">
                {selectedMovie ? 
                    (
                    <>
                        <h2 className="homepage-heading">Recommendations</h2>
                        <RecommendationsPopup movie={selectedMovie} /> 
                    </>) : null}

                    
            </div>
        </div>
    )
}

export default HomePage;