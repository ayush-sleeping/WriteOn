import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    posts.map(post => (
                        <div key={post.id} className="bg-secondary rounded-2xl shadow-md p-6 text-left">
                            <h2 className="text-2xl font-bold text-primary mb-2">{post.title}</h2>
                            <p className="text-base text-secondary mb-4 whitespace-pre-line">{post.content}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>By {post.author?.name || 'Unknown'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
