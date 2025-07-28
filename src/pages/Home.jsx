import React from 'react';

function Home() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Welcome to <span className="text-white">WriteOn</span></h1>
                <p className="text-lg md:text-xl text-secondary mb-8">This is the home page of our application. Start creating, sharing, and exploring amazing blogs with a beautiful, modern interface.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <a href="/create" className="px-6 py-3 rounded-full bg-secondary text-primary font-semibold hover:bg-white hover:text-secondary transition">Create Blog</a>
                    <a href="/login" className="px-6 py-3 rounded-full border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-primary transition">Log In</a>
                </div>
            </div>
        </div>
    );
}

export default Home;
