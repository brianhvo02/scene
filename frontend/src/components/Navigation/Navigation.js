import { useState } from 'react';
import logo from '../../../public/logo.png'
import { useSelector } from 'react-redux';
const Navigation = () => {
    const sessionUser = useSelector(state => state.session.user);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false)

    if (sessionUser){
        return (
            null
        )

    }else{
        return (
        <div className='header-nav-container'>
            <ul className='nav-bar'>
                <div className='left-nav'>
                    <div className='nav-logo'>
                        <NavLink className='nav-logo-container' to="/">
                            <img className="logo" src={logo} />
                        </NavLink>
                    </div>
                </div>
                {/* <div className='right-nav'>
                    <a className='text-link' href=''>Github</a>
                    <a className='text-link' href=''>LinkedIn</a>
                </div> */}
                <button className="login-button" onClick={() => { setShowLoginModal(true); setShowSignUpModal(false) }}>Log in</button>
                <button className="signup-button" onClick={() => { setShowLoginModal(false); setShowSignUpModal(true) }}>Sign up</button>
            </ul>
        </div>
        );
    }
    
}

export default Navigation;