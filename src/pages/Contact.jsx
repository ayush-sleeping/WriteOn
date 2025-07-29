import React from 'react';

function Contact() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="w-full max-w-6xl mx-auto bg-secondary rounded-2xl shadow-md p-8 text-left">
                <h1 className="text-3xl font-bold text-white mb-4">Contact WriteOn</h1>
                <p className="text-base text-secondary mb-6">
                    I’d love to hear from you! Whether you have feedback, want to report a bug, or just want to say hello, feel free to reach out using any of the methods below.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-primary/80 rounded-xl p-4 border border-secondary">
                        <h3 className="font-bold text-secondary mb-2">Email</h3>
                        <a
                            href="mailto:ayushbm84@gmail.com"
                            className="text-xs text-secondary underline hover:text-primary transition"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ayushbm84@gmail.com
                        </a>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Report a Bug or Vulnerability</h2>
                    <p className="text-secondary text-sm mb-2">
                        If you find a bug or security issue, please open an issue or discussion on GitHub, or email me directly.
                    </p>
                    <a
                        href="https://github.com/ayush-sleeping/WriteOn/issues"
                        className="text-xs text-secondary underline hover:text-primary transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Report on GitHub
                    </a>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Request a Feature</h2>
                    <p className="text-secondary text-sm mb-2">
                        Have an idea for a new feature? Start a new discussion or open a feature request on GitHub!
                    </p>
                    <a
                        href="https://github.com/ayush-sleeping/WriteOn/discussions"
                        className="text-xs text-secondary underline hover:text-primary transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Start a Discussion
                    </a>
                </div>
                <div className="mt-8 text-center">
                    <span className="inline-block bg-primary/80 text-secondary px-6 py-3 rounded-full font-semibold shadow border border-secondary text-lg">
                        Thanks for being part of the WriteOn journey!
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Contact;
