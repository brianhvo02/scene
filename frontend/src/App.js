import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
// import { AuthRoute, ProtectedRoute } from './components/Routes';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm.js'; 
import { getCurrentUser } from './store/session';

function App() {
        const [loaded, setLoaded] = useState(false);
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(getCurrentUser()).then(() => setLoaded(true));
        }, [dispatch]);

    return (
        
        <>
            {/* <NavBar/> */}
            <Routes>
                {/* <AuthRoute exact path="/" component={MainPage} /> */}
                <Route exact path="/login" Component={LoginForm} />
                <Route exact path="/signup" Component={SignupForm} />
            </Routes>
            
        </>
        
    );
}

export default App;
