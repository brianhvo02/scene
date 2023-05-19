import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom' 
import './index.scss';

const Footer = () => {
    return(
        <div className="footer-container">
            <div className="outside-links">
                <div className="information-container">
                    <h2>About Us</h2>
                    <Link to="/team">Our Team</Link>
                </div>
                <div className="information-container">
                    <h2>Technologies</h2>
                    <a href="https://www.mongodb.com/" target="blank">MongoDb / Mongoose</a>
                    <a href="https://expressjs.com/" target="blank">Express.js</a>
                    <a href="https://react-redux.js.org/" target="blank">React.js / Redux.js</a>
                    <a href="https://nodejs.org/en" target="blank">Node.js</a>
                    <a href="https://developer.themoviedb.org/docs" target="blank">The Movie Database</a>
                </div>
                <div className="information-container">
                    <h2>Contact Us</h2>
                    <a href="">Brian Huy Vo</a>
                    <a href="">Ningxiao Cao</a>
                    <a href="mailto: ed.bacsierra@gmail.com?subject=Mail from Our Scene">Eduardo Bac Sierra</a>
                    <a href="mailto: joshua.lee0195@gmail.com?subject=Mail from Our Scene">Joshua Lee</a>
                </div>
            </div>
            <div className="copyright">
                <p>© 2023 Scene made with ❤️ by yours truly</p>
                <a className="github-link" target="blank" href="https://github.com/brianhvo02/scene"><FontAwesomeIcon icon={faGithub} className="footer-icon"/></a>
            </div>
        </div>
    )
}

export default Footer;