import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '/src/assets/writeon_logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';
import './Header.css';

function Header({ setIsAuthenticated }) {
    // --- Auth & Profile State ---
    const isAuthenticated = localStorage.getItem("isAuth") === "true";
    const [profilePhoto, setProfilePhoto] = useState(auth.currentUser?.photoURL);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const profileDropdownRef = useRef(null);

    // --- Navigation ---
    const navigate = useNavigate();
    const location = useLocation();

    // --- Search State ---
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // --- Close search dropdown on outside click ---
    useEffect(() => {
        function handleClickOutsideSearch(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                event.target.closest('input[type="text"]') !== document.activeElement) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutsideSearch);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        };
    }, [showDropdown]);
    // ...existing code...

    // --- Close profile dropdown on outside click ---
    useEffect(() => {
        function handleClickOutsideProfile(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        }
        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutsideProfile);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideProfile);
        };
    }, [showProfileDropdown]);

    // --- Close mobile menu on outside click ---
    useEffect(() => {
        function handleClickOutside(event) {
            // Only close if click is outside the floating-navbar and mobile-menu-overlay
            const navbar = document.querySelector('.floating-navbar');
            const mobileMenu = document.querySelector('.mobile-menu-overlay');
            if (
                showMobileMenu &&
                !navbar.contains(event.target) &&
                (!mobileMenu || !mobileMenu.contains(event.target))
            ) {
                setShowMobileMenu(false);
            }
        }
        if (showMobileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMobileMenu]);

    // --- Search logic ---
    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (!value.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        // Fetch all posts from Firestore
        try {
            const { collection, getDocs } = await import('firebase/firestore');
            const { db } = await import('../../firebase-config');
            const postsRef = collection(db, 'posts');
            const snapshot = await getDocs(postsRef);
            const posts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Filter by title, content, or tags
            const filtered = posts.filter(post =>
                post.title?.toLowerCase().includes(value.toLowerCase()) ||
                post.content?.toLowerCase().includes(value.toLowerCase()) ||
                (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase())))
            );
            setResults(filtered);
            setShowDropdown(true);
        } catch (err) {
            setResults([]);
            setShowDropdown(false);
        }
    };

    // --- Handle click on search result ---
    const handleResultClick = (id) => {
        setShowDropdown(false);
        setSearch("");
        setResults([]);
        navigate(`/blog/${id}`);
    };

    // --- Sign out logic ---
    const signUserOut = () => {
        signOut(auth).then(() => {
            localStorage.removeItem("isAuth");
            if (setIsAuthenticated) setIsAuthenticated(false);
            navigate('/login');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };

    // --- Render ---
    return (
        <nav className="floating-navbar-container">
            <div className="floating-navbar">
                <div className="flex items-center justify-between gap-4 w-full">
                    {/* --- Left: Logo --- */}
                    <Link to="/" className="text-white text-xl font-bold hover:opacity-80 transition flex-shrink-0">
                        WriteOn
                    </Link>

                    {/* --- Center: Search (Desktop) --- */}
                    <div className="hidden lg:flex relative flex-1 max-w-md mx-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                            <svg className="search-icon h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearch}
                            className="search-input w-full h-10 pl-12 pr-10 rounded-full text-white placeholder:text-gray-400 outline-none text-sm transition"
                            autoComplete="off"
                            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                        />
                        {search && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition"
                                onClick={() => { setSearch(""); setResults([]); setShowDropdown(false); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {/* Search Results Dropdown */}
                        {showDropdown && results.length > 0 && (
                            <div ref={dropdownRef} className="search-dropdown absolute left-0 top-12 w-full rounded-xl z-50 max-h-80 overflow-y-auto">
                                {results.map(post => (
                                    <div
                                        key={post.id}
                                        className="search-dropdown-item px-4 py-3 cursor-pointer text-left transition-colors"
                                        onClick={() => handleResultClick(post.id)}
                                    >
                                        <div className="font-semibold text-white text-sm line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-gray-400">
                                            {post.createdAt
                                                ? (() => {
                                                    const d = typeof post.createdAt === "object" && post.createdAt.seconds
                                                        ? new Date(post.createdAt.seconds * 1000)
                                                        : new Date(post.createdAt);
                                                    return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
                                                })()
                                                : ""}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Center: Search (Mobile) --- */}
                    <div className="flex lg:hidden flex-1 mx-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                            <svg className="search-icon h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearch}
                            className="search-input w-full h-10 pl-10 pr-8 rounded-full text-white placeholder:text-gray-400 outline-none text-base transition"
                            autoComplete="off"
                            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                        />
                        {search && (
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition"
                                onClick={() => { setSearch(""); setResults([]); setShowDropdown(false); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {/* Mobile Search Results Dropdown */}
                        {showDropdown && results.length > 0 && (
                            <div ref={dropdownRef} className="search-dropdown absolute left-0 top-12 w-full rounded-xl z-50 max-h-80 overflow-y-auto mt-4">
                                {results.map(post => (
                                    <div
                                        key={post.id}
                                        className="search-dropdown-item px-4 py-3 cursor-pointer text-left transition-colors"
                                        onClick={() => { handleResultClick(post.id); setShowMobileMenu(false); }}
                                    >
                                        <div className="font-semibold text-white text-sm line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-gray-400">
                                            {post.createdAt
                                                ? (() => {
                                                    const d = typeof post.createdAt === "object" && post.createdAt.seconds
                                                        ? new Date(post.createdAt.seconds * 1000)
                                                        : new Date(post.createdAt);
                                                    return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
                                                })()
                                                : ""}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Right: Navigation & Auth --- */}
                    <div className="hidden lg:flex items-center gap-6">
                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className={`text-sm transition-all duration-300 ${location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-300 hover:text-white transition-all duration-300"
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-300 hover:text-white transition-all duration-300"
                            >
                                Contact
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/create"
                                    className="px-4 py-2 rounded-full text-sm text-gray-300 border primary-border hover:text-white hover:border-white-500 transition-all"
                                >
                                    Create
                                </Link>
                            )}
                        </div>

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileDropdown(v => !v)}
                                    className="focus:outline-none"
                                >
                                    <img
                                        src={auth.currentUser?.photoURL && auth.currentUser.photoURL.trim() !== ''
                                            ? auth.currentUser.photoURL
                                            : "https://randomuser.me/api/portraits/men/32.jpg"}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-600 hover:border-gray-500 transition"
                                    />
                                </button>
                                {showProfileDropdown && (
                                    <div ref={profileDropdownRef} className="profile-dropdown absolute right-0 mt-2 w-56 text-white rounded-xl z-50 p-4">
                                        <div className="font-semibold text-white text-sm mb-1">{auth.currentUser?.displayName || 'User'}</div>
                                        <div className="text-xs text-gray-400 break-all mb-4">{auth.currentUser?.email}</div>
                                        <div className="profile-dropdown-item w-full px-3 py-2 rounded-md text-sm font-medium mb-2 cursor-pointer text-white transition-colors">
                                            Your Blogs
                                        </div>
                                        <button
                                            className="profile-dropdown-item w-full px-3 py-2 rounded-md text-sm font-medium text-left cursor-pointer text-white hover:bg-red-600 transition-colors"
                                            onClick={() => { setShowProfileDropdown(false); signUserOut(); }}
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login">
                                    <button className="px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-600 hover:text-white hover:border-gray-500 transition-all">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/login">
                                    <button className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-gray-100 transition-all">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- Mobile Menu Toggle --- */}
                    <button
                        className="lg:hidden text-white text-xl focus:outline-none"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        ☰
                    </button>
                </div>

                {/* --- Mobile Menu --- */}
                {showMobileMenu && (
                    <div className="mobile-menu-overlay relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 text-white text-3xl bg-transparent border-none z-50"
                            aria-label="Close menu"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            &times;
                        </button>
                        <ul>
                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    About
                                </Link>
                            </li>
                            {isAuthenticated && (
                                <li>
                                    <Link
                                        to="/create"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Create
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    to="/contact"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Contact
                                </Link>
                            </li>
                            {!isAuthenticated && (
                                <li>
                                    <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                                        <button className="bg-white text-black">Login</button>
                                    </Link>
                                    <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                                        <button className="bg-white text-black mt-2">Sign Up</button>
                                    </Link>
                                </li>
                            )}
                            {isAuthenticated && (
                                <li>
                                    <button
                                        className="bg-red-600 text-white"
                                        onClick={() => { setShowMobileMenu(false); signUserOut(); }}
                                    >
                                        Log out
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Header;
