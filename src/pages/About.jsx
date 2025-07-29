import React from 'react';

function About() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="w-full max-w-6xl mx-auto bg-secondary rounded-2xl shadow-md p-8 text-left">
                <h1 className="text-3xl font-bold text-white mb-4">About WriteOn</h1>
                <p className="text-base text-secondary mb-4">
                    WriteOn is a personal project and learning platform for developers, creators, and tech enthusiasts. Inspired by the spirit of open collaboration, WriteOn is a space to write, share, and discover insightful content while I learn and grow as a React developer.
                </p>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">A Place for Learning & Sharing</h2>
                    <p className="text-secondary">
                        The software industry thrives on collaboration and networked learning. WriteOn is my experiment in building a modern blogging platform, where anyone can share their journey, tutorials, or thoughts on technology. Whether you’re a beginner or a pro, your voice matters here.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Open Source & Transparency</h2>
                    <p className="text-secondary">
                        WriteOn is built with React, Firebase, and Tailwind CSS. The code is open for anyone to explore, learn from, or contribute to. I believe in transparency and giving back to the developer ecosystem.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Why I Built WriteOn</h2>
                    <p className="text-secondary">
                        This project is my way of learning ReactJS and modern web development by building something real and useful. Every feature, bug fix, and improvement is a step in my journey as a developer. I hope WriteOn inspires others to build, share, and keep learning.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Get Involved</h2>
                    <p className="text-secondary mb-2">
                        Want to suggest a feature, report a bug, or just say hi? Reach out via the Contact page or check out the project on GitHub. Your feedback and ideas are always welcome!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex-1 bg-primary/80 rounded-xl p-4 border border-secondary">
                            <h3 className="font-bold text-secondary mb-2">Contact</h3>
                            <a
                                href="mailto:ayushbm84@gmail.com"
                                className="text-xs text-secondary underline hover:text-primary transition"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Email: ayushbm84@gmail.com
                            </a>
                        </div>
                        <div className="flex-1 bg-primary/80 rounded-xl p-4 border border-secondary">
                            <h3 className="font-bold text-secondary mb-2">GitHub</h3>
                            <a
                                href="https://github.com/ayush-sleeping/WriteOn"
                                className="text-xs text-secondary underline hover:text-primary transition"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                github.com/ayush-sleeping/WriteOn
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <span className="inline-block bg-primary/80 text-secondary px-6 py-3 rounded-full font-semibold shadow border border-secondary text-lg">
                        Happy coding ❤️ — Ayush Mishra
                    </span>
                </div>
            </div>
        </div>
    );
}

export default About;
