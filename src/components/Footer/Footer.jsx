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
                        <Link to="/" className="">Home</Link>
                        <Link to="/about" className="">About Us</Link>
                        <Link to="/contact" className="">Contact</Link>
                        <Link to="/code-of-conduct" className="">Code fo Conduct</Link>
                    </div>
                    {/* Quick Links Section */}
                    <div className="footer-modern-section">
                        <Link to="/privacy-policy" className="">Privacy</Link>
                        <Link to="/terms-of-use" className="">Terms</Link>

                        {localStorage.getItem("isAuth") === "true" ? (
                            <>
                                <Link to="/create" className="">
                                    Write
                                </Link>
                                <Link to="/myblogs" className="">
                                    My Blogs
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" className="">
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
