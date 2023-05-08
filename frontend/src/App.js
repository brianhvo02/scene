import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm.js'; 

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
                <AuthRoute exact path="/" component={MainPage} />
                <AuthRoute exact path="/login" component={LoginForm} />
                <AuthRoute exact path="/signup" component={SignupForm} />
            </Routes>
            
        </>
        
    );
}

export default App;
