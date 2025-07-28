import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '/src/assets/writeon_logo.png';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <img src={Logo} alt="WriteOn Logo" className="logo-img" height="44" width="44" />
                </div>
                <nav className="nav">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/create">Create</Link>
                    <Link className="nav-link" to="/login">Login</Link>
                </nav>
                <div className="header-actions">
                    <button className="search-toggle">Search</button>
                    <button className="btn">Sign Up</button>
                    <button className="btn">Login</button>
                </div>
            </div>
        </header>
    );
}

export default Header;
