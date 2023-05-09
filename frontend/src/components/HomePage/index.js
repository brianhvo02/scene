import './index.scss'
import DiscoverCarousel from './DiscoverCarousel';
import RecommendationsPopup from './RecommendationsPopup';

const HomePage = () => {

    return(
        <div className="homepage-container">
            <div className="discover-carousel">
                <DiscoverCarousel />
            </div>
            <div className="recommendations-pop-up">
                <RecommendationsPopup />
            </div>
        </div>
    )
}

export default HomePage;