import './App.scss';
import { Routes, Route } from 'react-router-dom'
import SplashPage from './components/SplashPage';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm.js'; 
import { getCurrentUser } from './store/session';
import HomePage from './components/HomePage';
import SelectGenresForm from './components/SessionForms/SelectGenresForm';
import MovieShow from './components/MovieShow';
import EventShow from './components/Events/EventsShow';
import Navigation from './components/Navigation/Navigation.js';
import { useLocation } from 'react-router-dom';
import SearchShow from './components/Search';


function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    const location = useLocation();

    const isSplashPage = location.pathname === '/';
    return (
        <>
        {!isSplashPage ? <Navigation /> : null}
        <Routes>
            <Route exact path="/search" Component={SearchShow}/>
            <Route exact path="/" Component={SplashPage}/>
            <Route exact path="/home" Component={HomePage}/>
            <Route exact path="/login" Component={LoginForm} />
            <Route exact path="/signup" Component={SignupForm} />
            <Route exact path="/signup/genres" Component={SelectGenresForm} />
            <Route exact path="/movie/:movieId" Component={MovieShow}/>
            <Route exact path="movie/:movieId/event/:eventId" Component={EventShow} />
        </Routes>
        </>
    );
}

export default App;
