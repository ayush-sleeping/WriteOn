import React from 'react';

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
                {/* Col 2 */}
                <div className="col2 footer-box mb-8 md:mb-0">
                    <p className="text-white font-semibold mb-2">About</p>
                    <p className="text-secondary mb-1 cursor-pointer hover:text-white transition">Our mission</p>
                    <p className="text-secondary mb-1 cursor-pointer hover:text-white transition">Privacy Policy</p>
                    <p className="text-secondary mb-1 cursor-pointer hover:text-white transition">Terms of service</p>
                </div>
                {/* Col 3 */}
                <div className="col3 footer-box">
                    <p className="text-white font-semibold mb-2">Services</p>
                    <p className="text-secondary mb-1 cursor-pointer hover:text-white transition">Products</p>
                    <p className="text-secondary mb-1 cursor-pointer hover:text-white transition">Join our team</p>
                    <p className="text-secondary mb-1 cursor-pointer hover:text-white transition">Partner with us</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
