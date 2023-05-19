import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn} from '@fortawesome/free-brands-svg-icons';
import './index.scss'


const TeamPage = () => {
    return(
        <div className="team-container">
            <h1>Meet the Team!!!</h1>
            <div className="coders-container">
                <div className="coder">
                    <img className="profile-pic" src="brian.jpeg"/>
                    <h2>Brian Huy Vo</h2>
                    <h3>Role: Team Lead</h3>
                    <div className="links">
                        <a className="github-link" target="blank" href="https://github.com/brianhvo02/brianhvo02"><FontAwesomeIcon icon={faGithub} className="footer-icon"/></a>
                        <a className="linkedin-link" target="blank" href="https://www.linkedin.com/in/brian-huy-vo/"><FontAwesomeIcon icon={faLinkedinIn} className="footer-icon" id="linked-in"/></a>
                    </div>
                </div>
                <div className="coder">
                    <img className="profile-pic" src="ningxiao.jpeg"/>
                    <h2>Ningxiao Cao</h2>
                    <h3>Role: Frontend Lead</h3>
                    <div className="links">
                        <a className="github-link" target="blank" href="https://github.com/kevinismcao/kevinismcao"><FontAwesomeIcon icon={faGithub} className="footer-icon"/></a>
                        <a className="linkedin-link" target="blank" href="https://www.linkedin.com/in/ningxiao-cao/"><FontAwesomeIcon icon={faLinkedinIn} className="footer-icon" id="linked-in"/></a>
                    </div>
                </div>
                <div className="coder">
                    <img className="profile-pic" src="eduardo.jpeg"/>
                    <h2>Eduardo Bac Sierra</h2>
                    <h3>Role: Backend Lead</h3>
                    <div className="links">
                        <a className="github-link" target="blank" href="https://github.com/bann-dito"><FontAwesomeIcon icon={faGithub} className="footer-icon"/></a>
                        <a className="linkedin-link" target="blank" href="https://www.linkedin.com/in/eduardobacsierra/"><FontAwesomeIcon icon={faLinkedinIn} className="footer-icon" id="linked-in" /></a>
                    </div>
                </div>
                <div className="coder">
                    <img className="profile-pic" src="joshua.jpeg"/>
                    <h2>Joshua Lee</h2>
                    <h3>Role: Flex Lead</h3>
                    <div className="links">
                        <a className="github-link" target="blank" href="https://github.com/joshua-lee-sf"><FontAwesomeIcon icon={faGithub} className="footer-icon"/></a>
                        <a className="linkedin-link" target="blank" href="https://www.linkedin.com/in/joshua-lee-sf/"><FontAwesomeIcon icon={faLinkedinIn} className="footer-icon" id="linked-in" /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamPage;