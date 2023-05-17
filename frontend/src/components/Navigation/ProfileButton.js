import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../store/session";
import { useNavigate } from "react-router-dom";
import './Navigation.scss'


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    


    const openMenu = () => {
      document.querySelector('.hamburger').classList.toggle('open');
      document.querySelector('.hamburger-side-menu').classList.toggle('active');
    }

    
      const handleClick = (e) => {
        dispatch(logout());
      };
    
      return (
        <div className="profile-button" ref={menuRef}>
          <button onClick={openMenu} className="hamburger" >
            <div id="bar1" className="bar"></div>
            <div id="bar2" className="bar"></div>
            <div id="bar3" className="bar"></div>
          </button>
          <nav className="hamburger-side-menu">
            <ul className="profile-dropdown">
              <li><img src={user?.photoUrl || '/scene-dark-logo-no-text.png'} alt="profile-picture" id="profile-pic" /></li>
              <li onClick={() => navigate('/user')}>{user?.username}</li>
              <li onClick={() => navigate('/home')}>Discover</li>
              <li onClick={handleClick} id="logout-button">Logout</li>
            </ul>
          </nav>
        </div>
      );
    }
    
    export default ProfileButton;