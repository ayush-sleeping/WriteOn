import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import Create from './pages/Create';
import Update from './pages/Update';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import CodeOfConduct from './pages/CodeOfConduct';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
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
            <div className='app bg-black'>
                <Header />
                <div className="pt-20 bg-black">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/create" element={<Create isAuthenticated={isAuthenticated} />} />
                        <Route path="/update/:id" element={<Update isAuthenticated={isAuthenticated} />} />
                        <Route path="/blog/:id" element={<Blog />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/code-of-conduct" element={<CodeOfConduct />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default App
