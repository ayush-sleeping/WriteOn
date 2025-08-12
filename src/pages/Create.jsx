import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

function Create({ isAuthenticated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const editorRef = useRef(null);
    const [tags, setTags] = useState([]); // array of tags
    const [tagInput, setTagInput] = useState('');
    const [coverImage, setCoverImage] = useState(null); // base64 string
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [coverImageError, setCoverImageError] = useState('');
    const postsCollectionRef = collection(db, 'posts');
    const navigate = useNavigate();

    // Add tag on space or blur
    const handleTagInput = (e) => {
        setTagInput(e.target.value);
    };
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

    // Cover image upload/validation
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

    const createPost = async (e) => {
        e.preventDefault();
        await addDoc(postsCollectionRef, {
            author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
            title,
            content,
            tags,
            coverImage,
            createdAt: serverTimestamp(),
        });
        navigate('/');
    };
    // Load Jodit editor via CDN and initialize
    useEffect(() => {
        // Debug: log isAuthenticated value
        console.log('isAuthenticated in Create:', isAuthenticated);
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }

        // Dynamically load Jodit CSS/JS if not already present
        if (!window.Jodit) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.css';
            document.head.appendChild(link);
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.js';
            script.onload = () => {
                if (editorRef.current && window.Jodit) {
                    window.joditInstance = window.Jodit.make(editorRef.current, {
                        buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'link', 'image', 'hr', '|', 'left', 'center', 'right', 'justify'],
                        height: 220,
                        events: {
                            change: (newValue) => setContent(newValue)
                        }
                    });
                }
            };
            document.body.appendChild(script);
        } else {
            if (editorRef.current && window.Jodit) {
                window.joditInstance = window.Jodit.make(editorRef.current, {
                    buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'link', 'image', 'hr', '|', 'left', 'center', 'right', 'justify'],
                    height: 220,
                    events: {
                        change: (newValue) => setContent(newValue)
                    }
                });
            }
        }
        // Cleanup on unmount
        return () => {
            if (window.joditInstance) {
                window.joditInstance.destruct();
                window.joditInstance = null;
            }
        };
    }, [isAuthenticated, navigate]);
    return (
        <div className="createPostPage min-h-[calc(100vh-80px)] bg-primary flex items-center justify-center px-6 py-12">
            <div className="max-w-5xl w-full bg-secondary rounded-2xl shadow-lg p-8">

                {/* Page Title */}
                <div className="border-b border-white/20 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">Create a New Post</h1>
                    <p className="text-sm text-white/70 mt-1">Fill out the form below to create a new blog post.</p>
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
                            onClick={createPost}
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-primary text-white border border-white/40 font-semibold shadow-sm hover:bg-white hover:text-primary transition"
                        >
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default Create;
