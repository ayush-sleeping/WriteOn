import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function Blog() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPost() {
            setLoading(true);
            setError(null);
            try {
                const postRef = doc(db, 'posts', id);
                const postSnap = await getDoc(postRef);
                if (postSnap.exists()) {
                    setPost({ ...postSnap.data(), id: postSnap.id });
                } else {
                    setError('Blog not found.');
                }
            } catch (err) {
                setError('Failed to load blog.');
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    if (loading) return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-secondary text-lg">Loading...</div>;
    if (error) return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-red-500 text-lg">{error}</div>;
    if (!post) return null;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="max-w-2xl w-full bg-secondary rounded-2xl shadow-lg p-8">
                {post.coverImage && (
                    <img src={post.coverImage} alt="Cover" className="mb-6 w-full max-h-80 object-contain rounded-xl border border-secondary" />
                )}
                <h1 className="text-4xl font-bold text-primary mb-4">{post.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(post.tags) && post.tags.map((tag, idx) => (
                        <span key={tag + idx} className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow border border-secondary">#{tag}</span>
                    ))}
                </div>
                <div className="text-base text-secondary prose prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>By {post.author?.name || 'Unknown'}</span>
                </div>
            </div>
        </div>
    );
}

export default Blog;
