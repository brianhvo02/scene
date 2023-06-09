import './App.scss';
import { Routes, Route, Navigate } from 'react-router-dom'
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
import UserProfile from './components/UserProfile';
import TeamPage from './components/TeamPage';
import Footer from './components/Footer';

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
            <Route path='*' element={<Navigate replace to='/home' />} />
            <Route exact path='/' Component={SplashPage}/>
            <Route exact path='/home' Component={HomePage}/>
            <Route exact path='/user' Component={UserProfile}/>
            <Route exact path='/search' Component={SearchShow}/>
            <Route exact path='/login' Component={LoginForm} />
            <Route exact path='/signup' Component={SignupForm} />
            <Route exact path='/signup/genres' Component={SelectGenresForm} />
            <Route exact path='/movie/:movieId' Component={MovieShow}/>
            <Route exact path='/movie/:movieId/event/:eventId' Component={EventShow} />
            <Route exact path='/team' Component={TeamPage}/>
        </Routes>
        <Footer />
        </>
    );
}

export default App;
