import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

function Create({ isAuthenticated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const postsCollectionRef = collection(db, 'posts');
    const navigate = useNavigate();
    const createPost = async (e) => {
        e.preventDefault();
        await addDoc(postsCollectionRef, {
            author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
            title,
            content,
            createdAt: serverTimestamp(),
        });
        navigate('/');
    };
    useEffect(() => {
        // Debug: log isAuthenticated value
        console.log('isAuthenticated in Create:', isAuthenticated);
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, navigate]);
    return (
        <div className="createPostPage min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full bg-secondary rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Create a New Post</h1>
                <p className="text-base text-secondary mb-6">Fill out the form below to create a new blog post.</p>
                <form className="w-full flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full px-4 py-3 rounded-full bg-primary text-secondary placeholder:text-secondary border-none outline-none text-base transition focus:bg-secondary-hover"
                        onChange={(event) => {
                            setTitle(event.target.value)
                        }}
                    />
                    <textarea
                        placeholder="Content"
                        className="w-full px-4 py-3 rounded-2xl bg-primary text-secondary placeholder:text-secondary border-none outline-none text-base min-h-[120px] resize-y transition focus:bg-secondary-hover"
                        onChange={(event) => {
                            setContent(event.target.value)
                        }}
                    />
                    <button
                        onClick={createPost}
                        type="submit"
                        className="flex items-center justify-center mt-6 w-full h-14 rounded-full text-[1.2rem] bg-primary text-color shadow-lg hover:bg-secondary-hover transition font-semibold gap-2"
                    >
                        <span>Publish Post</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Create;
