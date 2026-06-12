import React from 'react';

const ResumeViewer = () => {
    return (
        <div className="w-full h-full bg-slate-900 flex flex-col">
            <div className="bg-slate-800 p-2 flex justify-between items-center border-b border-slate-700">
                <span className="text-white font-semibold ml-2">Resume.pdf</span>
                <a
                    href="/Yash_cv_9_1_26.pdf"
                    download
                    className="px-3 py-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-500 transition-colors"
                >
                    Download
                </a>
            </div>
            {/* Iframe for PDF rendering */}
            <iframe
                src="/Yash_cv_9_1_26.pdf"
                className="w-full h-full border-none"
                title="Resume"
            />
        </div>
    );
};

export default ResumeViewer;
