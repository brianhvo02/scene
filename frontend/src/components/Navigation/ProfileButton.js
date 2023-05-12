import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../store/session";
import './Navigation.scss'


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    

    // const openMenu = () => {
    //     setShowMenu((prevShowMenu) => !prevShowMenu);
    //   };
    
    // useEffect(() => {
    //     const handleOutsideClick = (event) => {
    //       if (menuRef.current && !menuRef.current.contains(event.target)) {
    //         setShowMenu(false);
    //       }
    //     };
    
    //     document.addEventListener("click", handleOutsideClick);
    
    //     return () => {
    //       document.removeEventListener("click", handleOutsideClick);
    //     };
    //   }, []);


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
              <li>{user?.username}</li>
              <li>{user?.email}</li>
              <li onClick={handleClick} id="logout-button">Logout</li>
            </ul>
          </nav>
        </div>
      );
    }
    
    export default ProfileButton;