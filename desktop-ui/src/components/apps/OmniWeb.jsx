import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCcw, Lock, ExternalLink, Globe } from 'lucide-react';

const BLOCKED_DOMAINS = ['linkedin.com', 'github.com', 'google.com', 'bing.com', 'twitter.com', 'x.com', 'facebook.com', 'leetcode.com'];

const OmniWeb = ({ startUrl = 'https://www.wikipedia.org' }) => {
    // Wikipedia is iframe friendly.

    const [url, setUrl] = useState(startUrl);
    const [inputVal, setInputVal] = useState(startUrl);
    const [history, setHistory] = useState([startUrl]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        checkBlocked(startUrl);
        setInputVal(startUrl);
    }, [startUrl]);

    const checkBlocked = (targetUrl) => {
        const isBlockedDomain = BLOCKED_DOMAINS.some(domain => targetUrl.includes(domain));
        setIsBlocked(isBlockedDomain);
        return isBlockedDomain;
    };

    const handleNavigate = (e) => {
        e.preventDefault();
        let target = inputVal;
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        navigate(target);
    };

    const navigate = (target) => {
        checkBlocked(target);
        setUrl(target);

        // History management
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(target);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const openExternal = () => {
        window.open(url, '_blank');
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const prevUrl = history[newIndex];
            setUrl(prevUrl);
            setInputVal(prevUrl);
            checkBlocked(prevUrl);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextUrl = history[newIndex];
            setUrl(nextUrl);
            setInputVal(nextUrl);
            checkBlocked(nextUrl);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 relative">
            {/* Browser Toolbar */}
            <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-3 shrink-0">
                <div className="flex gap-1">
                    <button onClick={goBack} disabled={historyIndex === 0} className="p-1.5 hover:bg-slate-700 rounded-full disabled:opacity-30 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1.5 hover:bg-slate-700 rounded-full disabled:opacity-30 transition-colors">
                        <ArrowRight size={16} />
                    </button>
                    <button onClick={() => setUrl(url)} className="p-1.5 hover:bg-slate-700 rounded-full transition-colors">
                        <RotateCcw size={16} />
                    </button>
                </div>

                {/* Address Bar */}
                <form onSubmit={handleNavigate} className="flex-1">
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400">
                            {url.startsWith('https') ? <Lock size={12} /> : <Globe size={12} />}
                        </div>
                        <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/50 transition-all font-mono text-slate-300"
                        />
                    </div>
                </form>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-white overflow-hidden">
                {isBlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-600 gap-4 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                            <Lock size={32} className="text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Security Restriction</h2>
                        <p className="max-w-md">
                            <span className="font-semibold">{new URL(url).hostname}</span> prohibits embedding in external applications.
                        </p>
                        <button
                            onClick={openExternal}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Open in New Tab <ExternalLink size={16} />
                        </button>
                    </div>
                ) : (
                    <iframe
                        src={url}
                        className="w-full h-full border-none"
                        title="OmniWeb Browser"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation"
                    />
                )}
            </div>

            {/* Redirecting Medium FAB (Always Visible) */}
            <button
                onClick={openExternal}
                className="absolute bottom-6 right-6 p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 group"
                title="Open in Real Browser"
            >
                <ExternalLink size={24} />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                    Open Externally
                </span>
            </button>
        </div>
    );
};

export default OmniWeb;
