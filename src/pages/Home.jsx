// --- Imports ---
import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { Link } from 'react-router-dom';
import { FiHome, FiInfo, FiMail, FiShield, FiUser, FiFileText } from 'react-icons/fi';

function Home() {
    // --- State ---
    const [posts, setPosts] = useState([]); // All blog posts
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal visibility
    const [deletePostId, setDeletePostId] = useState(null); // Post ID to delete

    // --- Fetch all posts from Firestore, ordered by creation date (newest first) ---
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const postsRef = collection(db, 'posts');
            const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(postsQuery);
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } catch (err) {
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Fetch posts on mount ---
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // --- Get current user id (for author controls) ---
    const currentUserId = auth.currentUser?.uid;



    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            {/* --- Main Content Row: Hero, Blog List, and Active Discussions Side by Side --- */}
            <div className="w-full flex flex-col lg:flex-row gap-12 items-start justify-center">
                {/* --- Sidebar Section --- */}
                <div className="w-full lg:basis-[20%] flex flex-col gap-6 text-secondary text-sm mb-10 lg:mb-0">
                    <nav className="flex flex-col gap-2">
                        <Link to="/" className="hover:text-primary font-bold flex items-center gap-2"><FiHome /> Home</Link>
                        <Link to="/about" target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold flex items-center gap-2"><FiInfo /> About</Link>
                        <Link to="/contact" target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold flex items-center gap-2"><FiMail /> Contact</Link>
                        <Link to="/code-of-conduct" target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold flex items-center gap-2"><FiShield /> Code of Conduct</Link>
                        <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold flex items-center gap-2"><FiUser /> Privacy Policy</Link>
                        <Link to="/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-primary font-bold flex items-center gap-2"><FiFileText /> Terms of use</Link>
                    </nav>
                    <div>
                        <span className="font-bold text-primary text-base mb-2 block pt-4">Tags</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#webdev</span>
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#opensource</span>
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#machinelearning</span>
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#android</span>
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#git</span>
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#computerscience</span>
                            <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#kotlin</span>
                        </div>
                    </div>
                    <div className="mt-4 border-secondary pt-4">
                        <div className="bg-secondary rounded-2xl p-4">
                            <span className="font-bold text-primary text-base mb-2 block">WriteOn Community</span>
                            <p className="text-xs text-secondary mb-2">Welcome to WriteOn — your space to write, share, and discover insightful blogs from developers and creators around the world.</p>
                            <p className="text-xs text-secondary mb-2">Join the conversation, connect with like-minded people, and grow your knowledge in tech, coding, and beyond.</p>
                            <p className="text-xs text-secondary mb-2">WriteOn is built for the community, by the community. We believe in open sharing, learning, and supporting each other's journeys.</p>
                            <p className="text-xs text-secondary">Made with ❤️ using React, Firebase, and a passion for writing. WriteOn © 2025.</p>
                        </div>
                    </div>
                </div>

                {/* --- Blog Posts List --- */}
                <div className="w-full lg:basis-[50%] flex flex-col gap-6">
                    {loading ? (
                        <div className="text-secondary text-lg text-center">Loading posts...</div>
                    ) : error ? (
                        <div className="text-red-500 text-lg text-center">{error}</div>
                    ) : posts.length === 0 ? (
                        <div className="text-secondary text-lg text-center">No posts yet. Be the first to create one!</div>
                    ) : (
                        posts.map(post => {
                            // --- Check if current user is the author ---
                            const isAuthor = post.author?.id && currentUserId && post.author.id === currentUserId;
                            return (
                                <div key={post.id} className="relative group">
                                    {/* --- Blog Card --- */}
                                    <Link to={`/blog/${post.id}`} className="block bg-secondary rounded-2xl shadow-md p-6 text-left hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary">
                                        {/* --- Blog Cover Image --- */}
                                        {post.coverImage && (
                                            <img src={post.coverImage} alt="Cover" className="mb-4 w-full max-h-60 object-contain rounded-xl border border-secondary" />
                                        )}
                                        {/* --- Blog Title --- */}
                                        <h2 className="text-2xl font-bold text-primary mb-2">{post.title}</h2>
                                        {/* --- Blog Content Preview --- */}
                                        <div className="text-base text-secondary mb-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                                        {/* --- Blog Tags --- */}
                                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {post.tags.map((tag, idx) => (
                                                    <span key={tag + idx} className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                        {/* --- Blog Author --- */}
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>By {post.author?.name || 'Unknown'}</span>
                                        </div>
                                    </Link>
                                    {/* --- Author Controls (Delete/Update) --- */}
                                    {isAuthor && (
                                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                                            <button
                                                onClick={e => { e.preventDefault(); openDeleteModal(post.id); }}
                                                className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-700 transition"
                                                title="Delete this post"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                to={`/update/${post.id}`}
                                                className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold shadow hover:bg-blue-700 transition"
                                                title="Edit this post"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                Update
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* --- Active Discussions Section (Static) --- */}
                <div className="w-full lg:basis-[30%] flex flex-col gap-4 bg-secondary/80 rounded-2xl shadow-md mt-10 lg:mt-0">
                    <h2 className="text-xl font-bold text-white mb-4">Active Discussions</h2>
                    <ul className="flex flex-col gap-4">
                        <li className="bg-primary/80 rounded-xl p-4 flex flex-col gap-1 border border-secondary">
                            <span className="font-semibold text-secondary">Why I Ditched Cursor for Kiro - The Ultimate AI IDE for Beginners🚀</span>
                            <span className="text-xs text-gray-400">11 comments</span>
                        </li>
                        <li className="bg-primary/80 rounded-xl p-4 flex flex-col gap-1 border border-secondary">
                            <span className="font-semibold text-secondary">Top 7 Featured DEV Posts of the Week</span>
                            <span className="text-xs text-gray-400">4 comments</span>
                        </li>
                        <li className="bg-primary/80 rounded-xl p-4 flex flex-col gap-1 border border-secondary">
                            <span className="font-semibold text-secondary">Why I Chose 'ForgeCode' as #1 AI Coding Assistant in 2025?</span>
                            <span className="text-xs text-gray-400">5 comments</span>
                        </li>
                        <li className="bg-primary/80 rounded-xl p-4 flex flex-col gap-1 border border-secondary">
                            <span className="font-semibold text-secondary">A Lightweight 5-Star Rating System for PHP</span>
                            <span className="text-xs text-gray-400">1 comment</span>
                        </li>
                        <li className="bg-primary/80 rounded-xl p-4 flex flex-col gap-1 border border-secondary">
                            <span className="font-semibold text-secondary">First Contributions: learn how to contribute to open source projects</span>
                            <span className="text-xs text-gray-400">5 comments</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* --- Delete Confirmation Modal --- */}
            {/* ----------------------------------------------------------------------------- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold text-primary mb-4">Confirm Delete</h3>
                        <p className="text-secondary mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={closeDeleteModal}
                                className="px-5 py-2 rounded-full bg-gray-200 text-primary font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
