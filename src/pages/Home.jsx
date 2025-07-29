import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);

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

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Get current user id
    const currentUserId = auth.currentUser?.uid;

    // Open delete modal
    const openDeleteModal = (postId) => {
        setDeletePostId(postId);
        setShowDeleteModal(true);
    };

    // Close delete modal
    const closeDeleteModal = () => {
        setDeletePostId(null);
        setShowDeleteModal(false);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!deletePostId) return;
        await deleteDoc(doc(db, 'posts', deletePostId));
        setPosts(posts => posts.filter(post => post.id !== deletePostId));
        closeDeleteModal();
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="max-w-2xl w-full text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Welcome to <span className="text-white">WriteOn</span></h1>
                <p className="text-lg md:text-xl text-secondary mb-8">This is the home page of our application. Start creating, sharing, and exploring amazing blogs with a beautiful, modern interface.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Link to="/create" className="px-6 py-3 rounded-full bg-secondary text-primary font-semibold hover:bg-white hover:text-secondary transition">Create Blog</Link>
                    <Link to="/login" className="px-6 py-3 rounded-full border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-primary transition">Log In</Link>
                </div>
            </div>
            <div className="w-full max-w-2xl flex flex-col gap-6">
                {loading ? (
                    <div className="text-secondary text-lg text-center">Loading posts...</div>
                ) : error ? (
                    <div className="text-red-500 text-lg text-center">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="text-secondary text-lg text-center">No posts yet. Be the first to create one!</div>
                ) : (
                    posts.map(post => {
                        const isAuthor = post.author?.id && currentUserId && post.author.id === currentUserId;
                        return (
                            <div key={post.id} className="bg-secondary rounded-2xl shadow-md p-6 text-left relative">
                                {post.coverImage && (
                                    <img src={post.coverImage} alt="Cover" className="mb-4 w-full max-h-60 object-contain rounded-xl border border-secondary" />
                                )}
                                <h2 className="text-2xl font-bold text-primary mb-2">{post.title}</h2>
                                <div className="text-base text-secondary mb-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                                {Array.isArray(post.tags) && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {post.tags.map((tag, idx) => (
                                            <span key={tag + idx} className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>By {post.author?.name || 'Unknown'}</span>
                                </div>
                                {isAuthor && (
                                    <button
                                        onClick={() => openDeleteModal(post.id)}
                                        className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-700 transition"
                                        title="Delete this post"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Delete Confirmation Modal */}
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
