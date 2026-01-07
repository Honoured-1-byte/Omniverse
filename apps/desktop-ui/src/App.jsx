import React, { useState, useEffect } from 'react';
import knowledgeBase from '@data/knowledge-seed.json';
import { Terminal, ShoppingBag, Globe, Search, Gamepad2, Play, MessageCircle, Music, X, Maximize2, Minus, Video, Sparkles, StickyNote, Bot } from 'lucide-react';
import OmniBrain from './components/OmniBrain/OmniBrain';

// --- SYSTEM CONFIG ---
// 1. External Service
const APPS = [
    { id: 'wanderlust', name: 'WanderLust', icon: <Globe size={20} />, type: 'iframe', url: 'http://localhost:3001' },
    { id: 'commerce', name: 'Commerce', icon: <ShoppingBag size={20} />, type: 'iframe', url: 'http://localhost:3002' },
    { id: 'social', name: 'Social', icon: <MessageCircle size={20} />, type: 'iframe', url: 'http://localhost:3003' },


    // 2. Local Static Apps (Served by Vite from public/apps)
    { id: 'music', name: 'Music', icon: <Music size={20} />, type: 'iframe', url: '/apps/music-player/spotify/index.html' },
    { id: 'cinema', name: 'Cinema', icon: <Video size={20} />, type: 'iframe', url: '/apps/cinema/netflix-clone/index.html' },

    // GAMES (Hidden from main dock, shown in Games folder)
    { id: 'arcade', name: 'Simon', icon: <Gamepad2 size={20} />, type: 'iframe', url: '/apps/games/simon/index.html', category: 'game', hidden: true },
    { id: 'particles', name: 'Hand Magic', icon: <Sparkles size={20} />, type: 'iframe', url: '/apps/games/Particle_swarm/index.html', category: 'game', hidden: true },
    { id: 'chess', name: 'Chess', icon: <Gamepad2 size={20} />, type: 'iframe', url: '/apps/games/chess/index.html', category: 'game', hidden: true },
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: <Gamepad2 size={20} />, type: 'iframe', url: '/apps/games/tic-tac-toe/index.html', category: 'game', hidden: true },

    // 2b. Utilities
    { id: 'notepad', name: 'Notepad', icon: <StickyNote size={20} />, type: 'iframe', url: '/apps/notepad/index.html' },

    // 3. System Apps
    { id: 'games', name: 'Games', icon: <Gamepad2 size={20} />, type: 'system' }, // The Folder
    { id: 'brain', name: 'OmniBrain', icon: <Search size={20} />, type: 'system' },
    { id: 'term', name: 'Terminal', icon: <Terminal size={20} />, type: 'system' }
];

function App() {
    const [activeWindow, setActiveWindow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showReptile, setShowReptile] = useState(false);

    // TOGGLE REPTILE CURSOR
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.display = showReptile ? 'block' : 'none';
        }
    }, [showReptile]);

    // The Search Engine
    const searchResults = knowledgeBase.filter(node =>
        searchTerm && (
            node.concepts.includes(searchTerm.toLowerCase()) ||
            node.file.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="relative h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">

            {/* 1. REPTILE TOGGLE */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={() => setShowReptile(!showReptile)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${showReptile ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}
                >
                    {showReptile ? '🦎 ON' : '🦎 OFF'}
                </button>
            </div>

            {/* 2. DESKTOP ICONS */}
            <div className="absolute inset-0 p-4 grid grid-cols-1 gap-1 content-start justify-items-start z-0">
                {APPS.filter(app => !app.hidden).map(app => (
                    <button
                        key={app.id}
                        onClick={() => setActiveWindow(app.id)}
                        className="group flex flex-col items-center gap-1 hover:bg-slate-800/50 p-2 rounded-xl transition-all cursor-pointer w-20"
                    >
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-cyan-900/30 group-hover:text-cyan-400 transition-all border border-slate-700">
                            {app.icon}
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 group-hover:text-white leading-tight">{app.name}</span>
                    </button>
                ))}
            </div>

            {/* 3. WINDOW MANAGER */}
            {activeWindow && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40 pb-12">
                    <div className="w-[90%] h-[85%] max-w-[1200px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
                            <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                {APPS.find(a => a.id === activeWindow)?.icon}
                                {APPS.find(a => a.id === activeWindow)?.name}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-slate-700 rounded"><Minus size={14} /></button>
                                <button className="p-1 hover:bg-slate-700 rounded"><Maximize2 size={14} /></button>
                                <button onClick={() => setActiveWindow(null)} className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded"><X size={14} /></button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-0 overflow-hidden bg-slate-950 relative">

                            {/* SYSTEM: OmniBrain */}
                            {activeWindow === 'brain' && (
                                <div className="w-full h-full relative">
                                    <OmniBrain onClose={() => setActiveWindow(null)} />
                                    {/* Keep existing search UI as a background or alternative view if desired, but for now replacing it as requested to be the main view for 'brain' */}
                                </div>
                            )}

                            {/* SYSTEM: Games Folder */}
                            {activeWindow === 'games' && (
                                <div className="p-8 grid grid-cols-4 gap-6">
                                    {APPS.filter(a => a.category === 'game').map(game => (
                                        <button
                                            key={game.id}
                                            onClick={() => setActiveWindow(game.id)}
                                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-800 border border-transparent hover:border-cyan-500/30 transition-all group"
                                        >
                                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-cyan-500/20 text-cyan-400 transition-all duration-300">
                                                {game.icon}
                                            </div>
                                            <span className="text-sm font-medium text-slate-300 group-hover:text-white">{game.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* APP: Iframe Loader */}
                            {APPS.find(a => a.id === activeWindow)?.type === 'iframe' && (
                                <div className="w-full h-full bg-black relative">
                                    <iframe
                                        src={APPS.find(a => a.id === activeWindow)?.url}
                                        className="w-full h-full border-none block"
                                        title="Application Window"
                                        allow="camera; microphone; fullscreen; autoplay"
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )
            }

            {/* 4. TASKBAR */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-700/50 p-2 rounded-2xl flex gap-2 backdrop-blur-md shadow-2xl z-50">
                {APPS.filter(app => !app.hidden).map(app => (
                    <button
                        key={app.id}
                        onClick={() => setActiveWindow(app.id)}
                        className="p-2.5 rounded-xl hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        {app.icon}
                    </button>
                ))}
            </div>

        </div >
    );
}

export default App;
