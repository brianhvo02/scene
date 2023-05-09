import { useProtected } from '../../store/session';
import DiscoverCarousel from './DiscoverCarousel';
import RecommendationsPopup from './RecommendationsPopup';
import './index.scss'

const HomePage = () => {

    return(
        <div className="homepage-container">
            <div className="discover-carousel">
                <DiscoverCarousel />
            </div>
        </div>
    )
}

export default HomePage;