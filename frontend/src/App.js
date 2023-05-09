import './App.scss';
import { Routes, Route } from 'react-router-dom'
import SplashPage from './components/SplashPage';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm.js'; 
import { getCurrentUser } from './store/session';
import HomePage from './components/HomePage';

function App() {
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser()).then(() => setLoaded(true));
    }, [dispatch]);

    return (
        <Routes>
            {/* <NavBar/> */}
            <Route exact path="/" Component={SplashPage}/>
            <Route exact path="/home" Component={HomePage}/>
            <Route exact path="/login" Component={LoginForm} />
            <Route exact path="/signup" Component={SignupForm} />
        </Routes>
    );
}

export default App;
