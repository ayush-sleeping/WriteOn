import React from 'react';
import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // Handle successful authentication
                localStorage.setItem("isAuth", true);
                setIsAuthenticated(true);
                navigate('/'); // Redirect to home page after successful login
                console.log('User signed in:', result.user);
            })
            .catch((error) => {
                // Handle authentication errors
                console.error('Error signing in:', error);
            });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-secondary rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Sign in</h1>
                <p className="text-base text-secondary mb-8">Sign in to continue with your Google account.</p>
                <button
                    className="signin-with-google-btn flex items-center justify-center w-full h-14 rounded-full text-[1.2rem] bg-white text-gray-800 shadow-lg hover:bg-gray-100 transition gap-3 font-semibold border border-gray-300" onClick={signInWithGoogle}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}

export default Login;
