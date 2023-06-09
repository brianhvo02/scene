import { useEffect, useState } from 'react';
// import logo from '../../../public/logo.png'
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import { useProtected } from '../../store/session';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import Search from '../Search/Search';


const Navigation = () => {
    const sessionUser = useSelector(state => state.session.user);
    useProtected();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    const { pathname } = useLocation();

    return (
    <header className='header-nav-container'>
        <div className='nav-bar'>
            <div className='nav-left'>
                <div className='back-button' onClick={goBack} hidden={pathname.includes('home')}><MdOutlineArrowBackIos/></div>
                <div className='nav-logo'>
                    <NavLink className='nav-logo-container' to="/home">
                        <img className="logo" src="/scene-dark-logo-no-text.png" />
                    </NavLink>
                </div>
            </div>
            <div className='nav-search-bar-container'><Search /></div>
            <div className='nav-right'>
                <div className='profile-button-container'>
                    <ProfileButton user={sessionUser}/>
                </div>
            </div>
        </div>
    </header>
    );
    
}

export default Navigation;