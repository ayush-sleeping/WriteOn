import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate, useParams } from 'react-router-dom';

function Update({ isAuthenticated }) {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const editorRef = useRef(null);
    const joditInstanceRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [coverImageError, setCoverImageError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch existing post data
    useEffect(() => {
        async function fetchPost() {
            setLoading(true);
            const postRef = doc(db, 'posts', id);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const data = postSnap.data();
                setTitle(data.title || '');
                setContent(data.content || '');
                setTags(Array.isArray(data.tags) ? data.tags : []);
                setCoverImage(data.coverImage || null);
                setCoverImagePreview(data.coverImage || null);
                // Only allow author to edit
                if (!auth.currentUser || data.author?.id !== auth.currentUser.uid) {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            setLoading(false);
        }
        fetchPost();
    }, [id, navigate]);

    // Jodit editor setup: initialize only once, after content loads
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        if (loading) return;
        let destroyed = false;
        function initJodit() {
            if (editorRef.current && window.Jodit && !joditInstanceRef.current) {
                joditInstanceRef.current = window.Jodit.make(editorRef.current, {
                    buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'link', 'image', 'hr', '|', 'left', 'center', 'right', 'justify'],
                    height: 220,
                    events: {
                        change: (newValue) => setContent(newValue)
                    }
                });
                joditInstanceRef.current.value = content;
            }
        }
        if (!window.Jodit) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.css';
            document.head.appendChild(link);
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.js';
            script.onload = () => {
                if (!destroyed) initJodit();
            };
            document.body.appendChild(script);
        } else {
            initJodit();
        }
        return () => {
            destroyed = true;
            if (joditInstanceRef.current) {
                joditInstanceRef.current.destruct();
                joditInstanceRef.current = null;
            }
        };
    }, [isAuthenticated, navigate, loading]);

    // Tag logic (same as Create)
    const handleTagInput = (e) => setTagInput(e.target.value);
    const addTag = (tag) => {
        const cleanTag = tag.trim();
        if (cleanTag && !tags.includes(cleanTag)) {
            setTags([...tags, cleanTag]);
        }
    };
    const handleTagKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (tagInput.trim()) {
                addTag(tagInput);
                setTagInput('');
            }
        }
    };
    const handleTagBlur = () => {
        if (tagInput.trim()) {
            addTag(tagInput);
            setTagInput('');
        }
    };
    const removeTag = (removeIdx) => {
        setTags(tags.filter((_, idx) => idx !== removeIdx));
    };

    // Cover image upload/validation (same as Create)
    const handleCoverImageChange = (e) => {
        setCoverImageError('');
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setCoverImageError('Only PNG, JPEG, JPG, or WEBP images are allowed.');
            setCoverImage(null);
            setCoverImagePreview(null);
            return;
        }
        if (file.size > 1024 * 1024) {
            setCoverImageError('Image size must be less than 1MB.');
            setCoverImage(null);
            setCoverImagePreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImage(reader.result);
            setCoverImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Update post
    const updatePost = async (e) => {
        e.preventDefault();
        const postRef = doc(db, 'posts', id);
        await updateDoc(postRef, {
            title,
            content,
            tags,
            coverImage,
        });
        navigate('/');
    };

    if (loading) return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-secondary text-lg">Loading...</div>;

    return (
        <div className="createPostPage min-h-[calc(100vh-80px)] bg-primary flex items-center justify-center px-6 py-12">
            <div className="max-w-5xl w-full bg-secondary rounded-2xl shadow-lg p-8">

                {/* Page Title */}
                <div className="border-b border-white/20 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">Update Post</h1>
                    <p className="text-sm text-white/70 mt-1">Edit your blog post below and click update.</p>
                </div>

                <form className="space-y-8">
                    {/* Section 1 - Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Cover Image <span className="opacity-60">(optional)</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="cover-image-upload"
                                className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white border border-white/40 shadow-sm hover:bg-white hover:text-primary transition"
                            >
                                {coverImagePreview ? 'Change Image' : 'Upload Image'}
                            </label>
                            <input
                                id="cover-image-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                className="hidden"
                                onChange={handleCoverImageChange}
                            />
                            <span className="text-sm text-white/70">
                                {coverImagePreview ? 'Image selected' : 'No file chosen'}
                            </span>
                        </div>
                        {coverImageError && (
                            <p className="text-red-400 text-xs mt-1">{coverImageError}</p>
                        )}
                        {coverImagePreview && (
                            <img
                                src={coverImagePreview}
                                alt="Cover Preview"
                                className="mt-3 w-full max-h-56 object-contain rounded-xl border border-white/30"
                            />
                        )}
                    </div>

                    {/* Section 2 - Post Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="Enter post title"
                                className="w-full px-4 py-2.5 rounded-lg bg-primary text-white placeholder:text-white/60 border border-white/40 focus:border-white focus:ring-2 focus:ring-white/60 outline-none"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Tags</label>
                            <input
                                type="text"
                                placeholder="Add tags (press space, enter, or comma)"
                                className="w-full px-4 py-2.5 rounded-lg bg-primary text-white placeholder:text-white/60 border border-white/40 focus:border-white focus:ring-2 focus:ring-white/60 outline-none"
                                value={tagInput}
                                onChange={handleTagInput}
                                onKeyDown={handleTagKeyDown}
                                onBlur={handleTagBlur}
                            />
                        </div>
                    </div>

                    {/* Tags Display */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <span
                                    key={tag + idx}
                                    className="inline-flex items-center bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium border border-white/40 shadow-sm"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        className="ml-2 text-xs text-red-400 hover:text-red-600"
                                        onClick={() => removeTag(idx)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Section 3 - Content */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Content</label>
                        <div
                            ref={editorRef}
                            id="editor"
                            className="w-full px-4 py-2.5 rounded-lg bg-primary text-white border border-white/40 focus-within:border-white focus-within:ring-2 focus-within:ring-white/60 min-h-[280px]"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={updatePost}
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-primary text-white border border-white/40 font-semibold shadow-sm hover:bg-white hover:text-primary transition"
                        >
                            Update Post
                        </button>
                    </div>
                </form>
            </div>
        </div>




    );
}

export default Update;
