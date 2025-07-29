import React from 'react';

function PrivacyPolicy() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="w-full max-w-6xl mx-auto bg-secondary rounded-2xl shadow-md p-8 text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
                <p className="text-xs text-secondary mb-6">Last updated: July 29, 2025</p>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Introduction</h2>
                    <p className="text-secondary text-sm">
                        This Privacy Policy explains how WriteOn (a personal project by Ayush Mishra) collects, uses, and protects your information. As a small, non-commercial platform, I value your privacy and strive to keep things simple and transparent.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">What Information is Collected?</h2>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-2">
                        <li><b>Account Info:</b> If you sign up, your email and display name are stored securely.</li>
                        <li><b>Content:</b> Any posts, comments, or profile info you share are visible to others on the platform.</li>
                        <li><b>Usage Data:</b> Basic analytics (like page views) may be collected to improve the site. No tracking for advertising or third-party marketing.</li>
                    </ul>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">How is Your Information Used?</h2>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-2">
                        <li>To provide and improve the WriteOn platform.</li>
                        <li>To communicate with you about your account or site updates.</li>
                        <li>To keep the community safe and prevent abuse.</li>
                    </ul>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">How is Your Information Shared?</h2>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-2">
                        <li>Your public posts and comments are visible to all users.</li>
                        <li>Your email is never sold or shared with advertisers.</li>
                        <li>Data may be shared if required by law or to protect the platform and its users.</li>
                    </ul>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Your Rights & Choices</h2>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-2">
                        <li>You can update or delete your account at any time.</li>
                        <li>Contact me if you have questions or want your data removed.</li>
                    </ul>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Children's Privacy</h2>
                    <p className="text-secondary text-sm">
                        WriteOn is not intended for children under 13. I do not knowingly collect personal information from children. If you believe a child has provided personal info, please contact me for removal.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Third-Party Links</h2>
                    <p className="text-secondary text-sm">
                        WriteOn may link to other sites, but I am not responsible for their privacy practices. Please review their policies before sharing information.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Contact</h2>
                    <p className="text-secondary text-sm mb-2">
                        If you have any questions about this Privacy Policy or your data, please email:
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
                        Thanks for trusting WriteOn with your data!
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
