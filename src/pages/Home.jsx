// --- Imports ---
import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { Link } from 'react-router-dom';

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
                {/* --- Hero Section --- */}
                <div className="w-full lg:w-1/4 flex flex-col items-center text-center mb-10 lg:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Welcome to <span className="text-white">WriteOn</span></h1>
                    <p className="text-lg md:text-xl text-secondary mb-8">This is the home page of our application. Start creating, sharing, and exploring amazing blogs with a beautiful, modern interface.</p>
                    {/* --- Main Call-to-Action Buttons --- */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                        <Link to="/create" className="px-6 py-3 rounded-full bg-secondary text-primary font-semibold hover:bg-white hover:text-secondary transition">Create Blog</Link>
                        <Link to="/login" className="px-6 py-3 rounded-full border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-primary transition">Log In</Link>
                    </div>
                </div>

                {/* --- Blog Posts List --- */}
                <div className="w-full lg:w-2/4 flex flex-col gap-6">
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
                <div className="w-full lg:w-1/4 flex flex-col gap-4 bg-secondary/80 rounded-2xl p-6 shadow-md mt-10 lg:mt-0">
                    <h2 className="text-xl font-bold text-primary mb-4">Active Discussions</h2>
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
