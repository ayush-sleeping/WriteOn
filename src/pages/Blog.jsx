import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function Blog() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPostAndRelated() {
            setLoading(true);
            setError(null);
            try {
                const postRef = doc(db, 'posts', id);
                const postSnap = await getDoc(postRef);
                if (postSnap.exists()) {
                    const currentPost = { ...postSnap.data(), id: postSnap.id };
                    setPost(currentPost);
                    // Fetch all posts and filter by matching tags
                    const { collection, getDocs } = await import('firebase/firestore');
                    const postsRef = collection(db, 'posts');
                    const snapshot = await getDocs(postsRef);
                    const allPosts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    if (Array.isArray(currentPost.tags) && currentPost.tags.length > 0) {
                        const filtered = allPosts.filter(p =>
                            p.id !== currentPost.id &&
                            Array.isArray(p.tags) &&
                            p.tags.some(tag => currentPost.tags.includes(tag))
                        );
                        setRelatedPosts(filtered);
                    } else {
                        setRelatedPosts([]);
                    }
                } else {
                    setError('Blog not found.');
                }
            } catch (err) {
                setError('Failed to load blog.');
            } finally {
                setLoading(false);
            }
        }
        fetchPostAndRelated();
    }, [id]);

    if (loading) return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-white text-lg">Loading...</div>;
    if (error) return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-red-500 text-lg">{error}</div>;
    if (!post) return null;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-8xl bg-secondary rounded-3xl shadow-2xl p-0 flex flex-row overflow-hidden">
                {/* Author Section */}
                {/* ----------------------------------------------------------------------------- */}
                <div className="flex flex-col justify-start w-1/6 min-w-[120px] bg-primary/80 p-6 border-r border-secondary">
                    <div className="w-full bg-black rounded-xl shadow-lg p-4 flex flex-col">
                        <h3 className="text-lg text-white mb-2">Author</h3>
                        <span className="text-xl text-white font-bold">{post.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="w-full bg-black rounded-xl shadow-lg p-4 flex flex-col mt-4">
                        <h3 className="text-xl text-white mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {Array.isArray(post.tags) && post.tags.length > 0 ? (
                                post.tags.map((tag, idx) => (
                                    <span key={tag + idx} className="w-full block text-center my-1 inline-flex items-center bg-secondary text-white px-4 py-2 rounded-full text-base font-semibold shadow">#{tag}</span>
                                ))
                            ) : (
                                <span className="text-white/60">No tags</span>
                            )}
                        </div>
                    </div>
                </div>


                {/* Blog Section */}
                {/* ----------------------------------------------------------------------------- */}
                <div className="flex flex-col items-center justify-start w-7/12 px-10 py-12">
                    <h1 className="text-4xl font-extrabold text-white mb-6 text-center w-full">{post.title}</h1>
                    {post.coverImage && (
                        <div className="mb-8 w-full aspect-[16/9] overflow-hidden rounded-2xl border-2 border-secondary shadow-lg flex items-center justify-center bg-black">
                            <img src={post.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="text-lg text-white prose prose-invert max-w-none blog-content-white w-full mb-6">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>


                {/* Tags Related Blogs cards Section */}
                {/* ----------------------------------------------------------------------------- */}
                <div className="flex flex-col items-center justify-start w-1/4 min-w-[120px] bg-primary/80 p-6 border-l border-secondary">
                    <div className="w-full rounded-xl shadow-lg p-4 flex flex-col">
                        <h3 className="text-xl text-white mb-4 mt-2">Related Blogs</h3>
                        <div className="w-full flex flex-col gap-4">
                            {relatedPosts.length === 0 ? (
                                <span className="text-white/60">No related blogs found.</span>
                            ) : (
                                relatedPosts.map(rp => (
                                    <div key={rp.id} className="mb-4">
                                        <Link to={`/blog/${rp.id}`} className="block bg-primary rounded-2xl shadow-md p-4 text-left hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary">
                                            {rp.coverImage && (
                                                <div className="mb-4 w-full aspect-[16/9] overflow-hidden rounded-xl border border-secondary flex items-center justify-center bg-black">
                                                    <img src={rp.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                {(() => {
                                                    const maxWords = 3;
                                                    const words = (rp.title || '').split(' ');
                                                    return words.length > maxWords
                                                        ? words.slice(0, maxWords).join(' ') + '...'
                                                        : rp.title;
                                                })()}
                                            </h2>
                                            <div className="text-base text-secondary mb-4 max-w-none line-clamp-2 break-words overflow-hidden">
                                                {(() => {
                                                    const tempDiv = document.createElement('div');
                                                    tempDiv.innerHTML = rp.content || '';
                                                    const plainText = tempDiv.textContent || tempDiv.innerText || '';
                                                    return plainText;
                                                })()}
                                            </div>
                                            {Array.isArray(rp.tags) && rp.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {rp.tags.slice(0, 3).map((tag, idx) => (
                                                        <span key={tag + idx} className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow ">#{tag}</span>
                                                    ))}
                                                    {rp.tags.length > 3 && (
                                                        <span className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-xs font-medium shadow">...</span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>By {rp.author?.name || 'Unknown'}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Blog;
