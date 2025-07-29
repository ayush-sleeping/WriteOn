import React from 'react';

function CodeOfConduct() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-primary flex flex-col items-center px-4 py-12">
            <div className="w-full max-w-6xl mx-auto bg-secondary rounded-2xl shadow-md p-8 text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Code of Conduct</h1>
                <p className="text-xs text-secondary mb-6">Last updated July 31, 2023</p>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Our Pledge</h2>
                    <p className="text-secondary text-sm">
                        In the interest of fostering an open and welcoming environment, I pledge to make participation in WriteOn a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Our Standards</h2>
                    <p className="text-secondary text-sm mb-2">Examples of behavior that contributes to creating a positive environment include:</p>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-4">
                        <li>Using welcoming and inclusive language</li>
                        <li>Being respectful of differing viewpoints and experiences</li>
                        <li>Referring to people by their pronouns and using gender-neutral pronouns when uncertain</li>
                        <li>Gracefully accepting constructive criticism</li>
                        <li>Focusing on what is best for the community</li>
                        <li>Showing empathy towards other community members</li>
                        <li>Citing sources if used to create content</li>
                        <li>Disclosing AI assistance if used to create content</li>
                    </ul>
                    <p className="text-secondary text-sm mb-2">Examples of unacceptable behavior include:</p>
                    <ul className="list-disc list-inside text-secondary text-sm space-y-1 mb-4">
                        <li>The use of sexualized language or imagery and unwelcome sexual attention or advances</li>
                        <li>The use of hate speech or communication that is racist, homophobic, transphobic, ableist, sexist, or otherwise prejudiced/discriminatory</li>
                        <li>Trolling, insulting/derogatory comments, and personal or political attacks</li>
                        <li>Public or private harassment</li>
                        <li>Publishing others' private information without explicit permission</li>
                        <li>Plagiarizing content or misappropriating works</li>
                        <li>Other conduct which could reasonably be considered inappropriate in a professional setting</li>
                        <li>Dismissing or attacking inclusion-oriented requests</li>
                    </ul>
                    <p className="text-secondary text-xs mb-2">I pledge to prioritize marginalized people's safety over privileged people's comfort.</p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Enforcement</h2>
                    <p className="text-secondary text-sm mb-2">
                        Violations of the Code of Conduct may be reported by emailing <a href="mailto:ayushbm84@gmail.com" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">ayushbm84@gmail.com</a>. All reports will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances.
                    </p>
                    <p className="text-secondary text-sm mb-2">
                        I reserve the right and responsibility to remove comments or other contributions that are not aligned to this Code of Conduct or to suspend temporarily or permanently any members for other behaviors that are deemed inappropriate, threatening, offensive, or harmful.
                    </p>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-2">Attribution</h2>
                    <p className="text-secondary text-xs">
                        This Code of Conduct is adapted from:
                        <ul className="list-disc list-inside ml-4 mt-1">
                            <li>Contributor Covenant, version 1.4</li>
                            <li>Write/Speak/Code</li>
                            <li>Geek Feminism</li>
                        </ul>
                    </p>
                </div>
                <div className="mt-8 text-center">
                    <span className="inline-block bg-primary/80 text-secondary px-6 py-3 rounded-full font-semibold shadow border border-secondary text-lg">
                        Thank you for helping make WriteOn a welcoming and safe space!
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CodeOfConduct;
