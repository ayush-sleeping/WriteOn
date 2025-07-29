import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '/src/assets/writeon_logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';


function Header({ setIsAuthenticated }) {
    // --- Auth & Profile State ---
    const isAuthenticated = localStorage.getItem("isAuth") === "true";
    const [profilePhoto, setProfilePhoto] = useState(auth.currentUser?.photoURL);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef(null);

    // --- Navigation ---
    const navigate = useNavigate();

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
    // ...existing code...

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
        <header className="bg-primary sticky top-0 z-50">
            <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-3">
                {/* --- Left: Logo and Search --- */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link to="/">
                        <img src={Logo} alt="WriteOn Logo" className="h-11 w-24 border-6 border-black shadow-sm hover:opacity-80 transition" />
                    </Link>
                    {/* --- Search Bar --- */}
                    <div className="relative flex items-center w-[420px] md:w-[600px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        {/* --- Search Input --- */}
                        <input
                            type="text"
                            placeholder="Search..."
                            required
                            value={search}
                            onChange={handleSearch}
                            className="w-full h-12 pl-12 pr-14 rounded-full bg-secondary focus:bg-secondary-hover text-color placeholder:text-secondary border-none outline-none text-base transition"
                            autoComplete="off"
                            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                        />
                        {/* --- Clear Search Button --- */}
                        {search && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/60 transition"
                                onClick={() => { setSearch(""); setResults([]); setShowDropdown(false); }}
                                tabIndex={0}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-secondary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {/* --- Search Results Dropdown --- */}
                        {showDropdown && results.length > 0 && (
                            <div ref={dropdownRef} className="absolute left-0 top-14 w-full bg-secondary text-secondary rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                                {results.map(post => (
                                    <div
                                        key={post.id}
                                        className="px-5 py-3 cursor-pointer hover:bg-black text-left transition-colors"
                                        onClick={() => handleResultClick(post.id)}
                                    >
                                        <div className="font-semibold text-primary text-base line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-secondary">
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
                                {results.length === 0 && (
                                    <div className="px-5 py-3 text-secondary text-sm">No results found.</div>
                                )}
                            </div>
                        )}
                        {/* --- Send Message Button (placeholder) --- */}
                        <button
                            id="send-message-button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-[#a3a3a3] transition"
                            type="button"
                        >
                        </button>
                    </div>
                </div>
                {/* --- Right: Auth Buttons & Profile --- */}
                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <>
                            {/* --- Create Blog Button --- */}
                            <Link to="/create">
                                <button className="px-4 py-2 rounded-md bg-secondary text-secondary hover:!text-white font-medium transition-colors">Create</button>
                            </Link>
                            {/* --- Profile Dropdown --- */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileDropdown(v => !v)}
                                    className="focus:outline-none"
                                    aria-haspopup="true"
                                    aria-expanded={showProfileDropdown}
                                >
                                    <img
                                        key={auth.currentUser?.photoURL || auth.currentUser?.uid || 'default'}
                                        src={auth.currentUser?.photoURL && auth.currentUser.photoURL.trim() !== ''
                                            ? auth.currentUser.photoURL
                                            : (auth.currentUser ? "https://randomuser.me/api/portraits/men/32.jpg" : undefined)}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border-2 shadow-sm hover:opacity-80 transition"
                                        style={{ borderColor: 'var(--secondary-color)' }}
                                    />
                                </button>
                                {/* --- Profile Dropdown Content --- */}
                                {showProfileDropdown && (
                                    <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-56 bg-secondary text-secondary rounded-xl shadow-lg z-50 p-4 text-left">
                                        <div className="font-semibold text-primary text-base mb-1">{auth.currentUser?.displayName || 'User'}</div>
                                        <div className="text-xs text-secondary break-all mb-4">{auth.currentUser?.email}</div>
                                        <div className="w-full px-4 py-2 rounded-md font-medium mb-2 cursor-pointer select-none bg-primary hover:bg-secondary text-primary hover:text-secondary transition-colors">
                                            Your Blogs
                                        </div>
                                        <button
                                            className="w-full px-4 py-2 rounded-md font-medium text-left cursor-pointer bg-primary text-secondary hover:bg-secondary hover:text-primary transition-colors"
                                            onClick={() => { setShowProfileDropdown(false); signUserOut(); }}
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {/* --- Login Button (if not authenticated) --- */}
                    {!isAuthenticated && (
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
