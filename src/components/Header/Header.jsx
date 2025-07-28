import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '/src/assets/writeon_logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';


function Header({ setIsAuthenticated }) {
    const isAuthenticated = localStorage.getItem("isAuth") === "true";
    const navigate = useNavigate();
    const signUserOut = () => {
        signOut(auth).then(() => {
            localStorage.removeItem("isAuth");
            if (setIsAuthenticated) setIsAuthenticated(false);
            navigate('/login');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };
    return (
        <header className="bg-primary sticky top-0 z-50">
            <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Left: Logo and Search */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link to="/">
                        <img src={Logo} alt="WriteOn Logo" className="h-11 w-24 border-6 border-black shadow-sm hover:opacity-80 transition" />
                    </Link>
                    <div className="relative flex items-center w-[420px] md:w-[600px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                            {/* Search Icon (Heroicons solid magnifying-glass) */}
                            <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            required
                            className="w-full h-12 pl-12 pr-14 rounded-full bg-secondary focus:bg-secondary-hover text-color placeholder:text-secondary border-none outline-none text-base transition"
                        />
                        <button
                            id="send-message-button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-[#a3a3a3] transition"
                            type="submit"
                        >
                        </button>
                    </div>
                </div>
                {/* Right: Auth Buttons */}
                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <Link to="/create">
                            <button className="px-4 py-2 rounded-md bg-secondary text-secondary hover:!text-white font-medium transition-colors">Create</button>
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <button
                            className="px-4 py-2 rounded-md bg-secondary text-secondary hover:!text-white font-medium transition-colors"
                            onClick={signUserOut}
                        >
                            Log out
                        </button>
                    ) : (
                        <Link to="/login">
                            <button className="px-4 py-2 rounded-md bg-secondary text-secondary hover:!text-white font-medium transition-colors">Log in</button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;



// <Link to="/profile">
//     <img
//         src="https://randomuser.me/api/portraits/men/32.jpg"
//         alt="Profile"
//         className="w-10 h-10 rounded-full object-cover border-2 shadow-sm hover:opacity-80 transition"
//         style={{ borderColor: 'var(--secondary-color)' }}
//     />
// </Link>
