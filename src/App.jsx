import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Create from './pages/Create';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return (
        <Router basename="/WriteOn">
            <ScrollToTop />
            <div className='app'>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/create" element={<Create />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App
