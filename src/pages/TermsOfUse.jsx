import React from 'react';

function TermsOfUse() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="w-full max-w-6xl mx-auto bg-secondary rounded-2xl shadow-md p-8 text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Terms of Use</h1>
                <p className="text-xs text-secondary mb-6">Last updated: July 29, 2025</p>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
                    <p className="text-secondary text-sm">
                        By accessing or using WriteOn, you agree to be bound by these Terms of Use and the Privacy Policy. If you do not agree, please do not use the site.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">2. Use License</h2>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-2">
                        <li>You may view and share content for personal, non-commercial use only.</li>
                        <li>You may not copy, modify, or redistribute content without permission.</li>
                        <li>Reverse engineering or scraping of the site is not allowed.</li>
                    </ul>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">3. Disclaimer</h2>
                    <p className="text-secondary text-sm">
                        All content is provided "as is" without warranties of any kind. I do not guarantee the accuracy or reliability of any content on WriteOn.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">4. Limitations</h2>
                    <p className="text-secondary text-sm">
                        In no event shall WriteOn or its creator be liable for any damages arising out of the use or inability to use the site.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">5. Content Policy</h2>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-2">
                        <li>Only share content you have the rights to post.</li>
                        <li>No plagiarism, hate speech, or illegal content.</li>
                        <li>Posts should be on-topic and add value to the community.</li>
                        <li>Affiliate links must be clearly disclosed.</li>
                    </ul>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">6. Changes to Terms</h2>
                    <p className="text-secondary text-sm">
                        These terms may be updated at any time. Continued use of WriteOn means you accept the current version of the Terms of Use.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">7. Contact</h2>
                    <p className="text-secondary text-sm mb-2">
                        For questions about these terms, please email:
                    </p>
                    <a
                        href="mailto:ayushbm84@gmail.com"
                        className="text-xs text-secondary underline hover:text-primary transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ayushbm84@gmail.com
                    </a>
                </div>
                <div className="mt-8 text-center">
                    <span className="inline-block bg-primary/80 text-secondary px-6 py-3 rounded-full font-semibold shadow border border-secondary text-lg">
                        Thanks for using WriteOn!
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TermsOfUse;
