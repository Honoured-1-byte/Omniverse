import React from 'react';
import { HARBOR_APPS } from '../../config/harborRegistry.jsx';

const MobileLauncher = () => {
    const handleAppClick = (app) => {
        if (app.type === 'harbor' || app.url) {
            window.location.href = app.url;
        } else {
            alert('This native app is best viewed on Desktop for now.');
        }
    };

    // Separate Dock apps (e.g., first 4) from the rest
    const dockApps = HARBOR_APPS.slice(0, 4);
    const gridApps = HARBOR_APPS.slice(4);

    return (
        <div className="h-screen w-screen bg-cover bg-center text-white overflow-hidden flex flex-col" style={{ backgroundImage: "url('/magical-waterfall-moonlight.jpg')" }}>

            {/* 1. iOS-style Status Bar (Mock) */}
            <div className="h-12 w-full flex justify-between items-end px-6 pb-2 text-xs font-semibold tracking-wide bg-gradient-to-b from-black/50 to-transparent">
                <span>9:41</span>
                <div className="flex gap-1.5">
                    <span>5G</span>
                    <span>100%</span>
                </div>
            </div>

            {/* 2. Main App Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 pt-8">
                <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    {gridApps.map(app => (
                        <div key={app.id} className="flex flex-col items-center gap-1 group" onClick={() => handleAppClick(app)}>
                            {/* App Icon Shape */}
                            <button className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 active:scale-95 transition-transform shadow-lg group-active:bg-white/20">
                                <div className="text-white">
                                    {React.cloneElement(app.icon, { size: 30 })}
                                </div>
                            </button>
                            {/* App Label */}
                            <span className="text-[10px] text-white/90 font-medium text-center leading-tight truncate w-full px-1 drop-shadow-md">
                                {app.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Page Dots */}
            <div className="flex justify-center gap-1.5 pb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            </div>

            {/* 4. Dock (Glassmorphism) */}
            <div className="px-4 pb-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-4 flex justify-around items-center border border-white/5 mx-2 shadow-2xl">
                    {dockApps.map(app => (
                        <button
                            key={app.id}
                            onClick={() => handleAppClick(app)}
                            className="w-12 h-12 flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                                {React.cloneElement(app.icon, { size: 22, className: "text-cyan-400" })}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileLauncher;
