import './App.css';
import { Routes, Route } from 'react-router-dom'
import SplashPage from './components/SplashPage';


function App() {
    return (
        <Routes>
            <Route exact path="/" Component={SplashPage}/>
        </Routes>
    );
}

export default App;
