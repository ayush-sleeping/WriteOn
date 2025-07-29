import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer-main">
            {/* Gradient overlay */}
            <div className="footer-gradient" />
            {/* Blur backdrop */}
            <div className="footer-blur" />
            <div className="footer-content">
                {/* Col 1 */}
                <div className="col flex flex-col items-start w-full md:w-1/3 mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold title mb-2">WriteOn</h3>
                    <p className="text-secondary mb-2">Made with <span className="text-[#BA6573]">❤</span> by Ayush</p>
                    <p className="text-[#818181] text-xs">2025 © All Rights Reserved</p>
                </div>
                {/* Col 2: About Navigation */}
                <div className="col2 footer-box mb-8 md:mb-0">
                    <p className="text-white font-semibold mb-2">About</p>
                    <Link to="/about" className="text-secondary mb-1 cursor-pointer hover:text-white transition block">Our mission</Link>
                    <Link to="/privacy" className="text-secondary mb-1 cursor-pointer hover:text-white transition block">Privacy Policy</Link>
                    <Link to="/terms" className="text-secondary mb-1 cursor-pointer hover:text-white transition block">Terms of service</Link>
                </div>
                {/* Col 3: Blog Navigation */}
                <div className="col3 footer-box">
                    <p className="text-white font-semibold mb-2">Blog</p>
                    {localStorage.getItem("isAuth") === "true" ? (
                        <>
                            <Link to="/create" className="text-secondary mb-1 cursor-pointer hover:text-white transition block">Write a Blog</Link>
                            <Link to="/myblogs" className="text-secondary mb-1 cursor-pointer hover:text-white transition block">My Blogs</Link>
                        </>
                    ) : (
                        <Link to="/login" className="text-secondary mb-1 cursor-pointer hover:text-white transition block">Log In</Link>
                    )}
                    <a
                        href="https://github.com/ayush-sleeping/WriteOn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary mb-1 cursor-pointer hover:text-white transition block"
                    >
                        FAQ / Help
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
