import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-modern">
            <div className="footer-modern-container">
                <div className="footer-modern-content">
                    {/* Company Section */}
                    <div className="footer-modern-section">
                        <Link to="/" target="_blank" rel="noopener noreferrer" className="">Home</Link>
                        <Link to="/about" target="_blank" rel="noopener noreferrer" className="">About Us</Link>
                        <Link to="/contact" target="_blank" rel="noopener noreferrer" className="">Contact</Link>
                        <Link to="/code-of-conduct" target="_blank" rel="noopener noreferrer" className="">Code fo Conduct</Link>
                    </div>
                    {/* Quick Links Section */}
                    <div className="footer-modern-section">
                        <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="">Privacy</Link>
                        <Link to="/terms-of-use" target="_blank" rel="noopener noreferrer" className="">Terms</Link>

                        {localStorage.getItem("isAuth") === "true" ? (
                            <>
                                <Link to="/create" target="_blank" rel="noopener noreferrer" className="">
                                    Write
                                </Link>
                                <Link to="/myblogs" target="_blank" rel="noopener noreferrer" className="">
                                    My Blogs
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" target="_blank" rel="noopener noreferrer" className="">
                                Login
                            </Link>
                        )}
                    </div>
                    {/* Connect Section */}
                    <div className="footer-modern-section">
                        <a href="mailto:hello@company.com">hello@writeon.com</a>
                        <a href="#">Follow Us</a>
                    </div>
                </div>
                <div className="footer-modern-bottom">
                    <p>&copy; 2025 WriteOn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
