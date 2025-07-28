import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Create from './pages/Create';

function App() {
    return (
        <Router basename="/WriteOn">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/create">Create</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<Create />} />
            </Routes>
        </Router>
    );
}

export default App
