// --- Imports ---
import React, { useEffect, useState, useCallback } from 'react';
import formula1Img from '../assets/formula1.png';
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


    // --- Delete Modal Handlers ---
    const openDeleteModal = (postId) => {
        setDeletePostId(postId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeletePostId(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!deletePostId) return;
        try {
            await deleteDoc(doc(db, 'posts', deletePostId));
            setPosts(posts.filter(post => post.id !== deletePostId));
            setDeletePostId(null);
            setShowDeleteModal(false);
        } catch (err) {
            setError('Failed to delete post. Please try again.');
        }
    };

    // --- Get current user id (for author controls) ---
    const currentUserId = auth.currentUser?.uid;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            {/* --- Banner --- */}
            {/* ----------------------------------------------------------------------------- */}
            <div
                className="w-full rounded-2xl relative px-6 mb-10 flex items-center justify-center shadow-lg overflow-hidden min-h-[440px] md:min-h-[600px]"
                style={posts.length > 0 && posts[0].coverImage ? {
                    backgroundImage: `url('${posts[0].coverImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } : {
                    backgroundImage: `url(${formula1Img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {posts.length > 0 ? (
                    <div className="flex w-full items-center justify-center">
                        <div className="max-w-8xl w-full mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl px-10 py-5 flex flex-col items-start" style={{ marginTop: '20rem' }}>
                            <h4 className="text-lg md:text-xl text-white mb-3 font-semibold tracking-wide">Featured Blog</h4>
                            <h2 className="text-5xl md:text-6xl text-white mb-5 font-extrabold leading-tight">
                                {(() => {
                                    const maxWords = 5;
                                    const words = (posts[0].title || '').split(' ');
                                    return words.length > maxWords
                                        ? words.slice(0, maxWords).join(' ') + '...'
                                        : posts[0].title;
                                })()}
                            </h2>
                            <div className="text-lg md:text-xl text-gray-100 prose prose-invert mb-2">
                                {(() => {
                                    const maxWords = 30;
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = posts[0].content || '';
                                    const plainText = tempDiv.textContent || tempDiv.innerText || '';
                                    const words = plainText.split(/\s+/);
                                    return words.length > maxWords
                                        ? words.slice(0, maxWords).join(' ') + '...'
                                        : plainText;
                                })()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-center">
                        <div className="max-w-8xl w-full mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl px-10 py-5 flex flex-col items-start" style={{ marginTop: '20rem' }}>
                            <h4 className="text-lg md:text-xl text-white mb-3 font-semibold tracking-wide">Featured Blog</h4>
                            <h2 className="text-5xl md:text-6xl text-white mb-5 font-extrabold leading-tight">Welcome to WriteOn</h2>
                            <div className="text-lg md:text-xl text-gray-100 prose prose-invert mb-2">
                                Share your thoughts, read inspiring stories, and connect with a community of writers. Start your blogging journey today!
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* --- Section Title --- */}
            {/* ----------------------------------------------------------------------------- */}
            <h1 className="w-full text-xl font-semibold text-white mb-6 text-left ml-8">Recent Blog Posts</h1>
            {/* --- Main Content Row: Hero, Blog List, and Active Discussions Side by Side --- */}
            <div className="w-full flex flex-col lg:flex-row gap-12 items-start justify-center">
                {/* --- Blog Posts List --- */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <Link to={`/blog/${post.id}`} className="block bg-primary rounded-2xl shadow-md p-4 text-left hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary">
                                        {/* --- Blog Cover Image --- */}
                                        {post.coverImage && (
                                            <div className="mb-4 w-full aspect-[16/9] overflow-hidden rounded-xl border border-secondary flex items-center justify-center bg-black">
                                                <img src={post.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        {/* --- Blog Title --- */}
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            {(() => {
                                                const maxWords = 3;
                                                const words = (post.title || '').split(' ');
                                                return words.length > maxWords
                                                    ? words.slice(0, maxWords).join(' ') + '...'
                                                    : post.title;
                                            })()}
                                        </h2>
                                        {/* --- Blog Content Preview --- */}
                                        <div
                                            className="text-base text-secondary mb-4 max-w-none line-clamp-2 break-words overflow-hidden"
                                        >
                                            {(() => {
                                                // Strip HTML tags and decode entities
                                                const tempDiv = document.createElement('div');
                                                tempDiv.innerHTML = post.content || '';
                                                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                                                return plainText;
                                            })()}
                                        </div>
                                        {/* --- Blog Tags --- */}
                                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {post.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={tag + idx} className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow ">#{tag}</span>
                                                ))}
                                                {post.tags.length > 3 && (
                                                    <span className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow">...</span>
                                                )}
                                            </div>
                                        )}
                                        {/* --- Blog Author --- */}
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>By {post.author?.name || 'Unknown'}</span>
                                        </div>
                                    </Link>
                                    {/* --- Author Controls (Delete/Update) --- */}
                                    {isAuthor && (
                                        <div className="absolute top-6 right-6 flex gap-2 z-10">
                                            <button
                                                onClick={e => { e.preventDefault(); openDeleteModal(post.id); }}
                                                className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold shadow transition duration-200 hover:bg-white hover:text-black hover:border-white"
                                                title="Delete this post"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                to={`/update/${post.id}`}
                                                className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold shadow transition duration-200 hover:bg-white hover:text-black hover:border-white"
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
            </div>


            {/* --- Delete Confirmation Modal --- */}
            {/* ----------------------------------------------------------------------------- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold text-primary mb-4">Confirm Delete</h3>
                        <p className="text-primary mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={closeDeleteModal}
                                className="px-5 py-2 rounded-full bg-gray-200 text-primary font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-full bg-black text-white font-semibold hover:bg-red-700 hover:text-white transition"
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
