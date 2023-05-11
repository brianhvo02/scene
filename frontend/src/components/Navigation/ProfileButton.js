import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Navigation.scss'


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    

    const openMenu = () => {
        setShowMenu((prevShowMenu) => !prevShowMenu);
      };
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
          }
        };
    
        document.addEventListener("click", handleOutsideClick);
    
        return () => {
          document.removeEventListener("click", handleOutsideClick);
        };
      }, []);
    
      const logout = (e) => {
        e.preventDefault();
      };
    
      return (
        <div className="profile-button" ref={menuRef}>
          <button onClick={openMenu} className="profile-icon" >
            Profile
            <i className="fa-regular fa-user"></i>
          </button>
          {showMenu && (
            <ul className="profile-dropdown">
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={logout} className="button">
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </div>
      );
    }
    
    export default ProfileButton;