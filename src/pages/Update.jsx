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
        <div className="createPostPage min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full bg-secondary rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Update Post</h1>
                <p className="text-base text-secondary mb-6">Edit your blog post below and click update.</p>
                <form className="w-full flex flex-col gap-4">
                    {/* Cover image upload */}
                    <div className="mb-2">
                        <label className="block text-secondary font-medium mb-1">Cover Image (optional)</label>
                        <div className="flex items-center gap-3">
                            <label htmlFor="cover-image-upload" className="cursor-pointer px-4 py-2 rounded-full bg-primary text-secondary border border-secondary font-medium shadow hover:bg-secondary hover:text-primary transition">
                                <span className="material-symbols-rounded align-middle mr-1 text-lg"></span>
                                {coverImagePreview ? 'Change Image' : 'Upload Image'}
                            </label>
                            <input
                                id="cover-image-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                className="hidden"
                                onChange={handleCoverImageChange}
                            />
                            <span className="text-xs text-secondary">
                                {coverImagePreview ? 'Image selected' : 'No file chosen'}
                            </span>
                        </div>
                        {coverImageError && <div className="text-red-500 text-sm mt-1">{coverImageError}</div>}
                        {coverImagePreview && (
                            <img src={coverImagePreview} alt="Cover Preview" className="mt-2 w-full max-h-60 object-contain rounded-xl border border-secondary" />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full px-4 py-3 rounded-full bg-primary text-secondary placeholder:text-secondary border-none outline-none text-base transition focus:bg-secondary-hover"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <div>
                        <label className="block text-secondary font-medium mb-1">Content</label>
                        <div
                            ref={editorRef}
                            id="editor"
                            className="w-full px-4 py-3 rounded-2xl bg-primary text-secondary border border-secondary focus-within:bg-secondary-hover min-h-[120px] transition"
                            style={{ minHeight: 120, background: 'var(--primary-color)' }}
                        />
                    </div>
                    {/* Tag display just above tag input */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag, idx) => (
                                <span key={tag + idx} className="inline-flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-sm font-medium shadow border border-secondary">
                                    #{tag}
                                    <button type="button" className="ml-2 text-xs text-red-400 hover:text-red-600" onClick={() => removeTag(idx)}>&times;</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Add tags (type and press space, enter, or comma)"
                        className="w-full px-4 py-3 rounded-full bg-primary text-secondary placeholder:text-secondary border-none outline-none text-base transition focus:bg-secondary-hover"
                        value={tagInput}
                        onChange={handleTagInput}
                        onKeyDown={handleTagKeyDown}
                        onBlur={handleTagBlur}
                    />
                    <button
                        onClick={updatePost}
                        type="submit"
                        className="flex items-center justify-center mt-6 w-full h-14 rounded-full text-[1.2rem] bg-primary text-color shadow-lg hover:bg-secondary-hover transition font-semibold gap-2"
                    >
                        <span>Update Post</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Update;
