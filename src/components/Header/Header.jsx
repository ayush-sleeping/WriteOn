import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '/src/assets/writeon_logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';


function Header({ setIsAuthenticated }) {
    const isAuthenticated = localStorage.getItem("isAuth") === "true";
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Search logic
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

    // Handle click on result
    const handleResultClick = (id) => {
        setShowDropdown(false);
        setSearch("");
        setResults([]);
        navigate(`/blog/${id}`);
    };

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
                            <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
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
                        {showDropdown && results.length > 0 && (
                            <div ref={dropdownRef} className="absolute left-0 top-14 w-full bg-white border border-secondary rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                                {results.map(post => (
                                    <div
                                        key={post.id}
                                        className="px-5 py-3 cursor-pointer hover:bg-secondary/20 text-left"
                                        onClick={() => handleResultClick(post.id)}
                                    >
                                        <div className="font-semibold text-primary text-base line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-secondary line-clamp-1">{post.content?.replace(/<[^>]+>/g, '').slice(0, 60)}...</div>
                                    </div>
                                ))}
                                {results.length === 0 && (
                                    <div className="px-5 py-3 text-secondary text-sm">No results found.</div>
                                )}
                            </div>
                        )}
                        <button
                            id="send-message-button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-[#a3a3a3] transition"
                            type="button"
                        >
                        </button>
                    </div>
                </div>
                {/* Right: Auth Buttons */}
                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <>
                            <Link to="/profile">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 shadow-sm hover:opacity-80 transition"
                                    style={{ borderColor: 'var(--secondary-color)' }}
                                />
                            </Link>
                            <Link to="/create">
                                <button className="px-4 py-2 rounded-md bg-secondary text-secondary hover:!text-white font-medium transition-colors">Create</button>
                            </Link>
                        </>
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
