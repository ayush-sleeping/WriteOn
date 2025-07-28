import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Create from './pages/Create';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import { signOut } from 'firebase/auth';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Read from localStorage to persist auth state across reloads
        return localStorage.getItem("isAuth") === "true";
    });
    return (
        <>
            <ScrollToTop />
            <div className='app'>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/create" element={<Create isAuthenticated={isAuthenticated} />} />
                </Routes>
                <Footer />
            </div>
        </>
    );
}

export default App
