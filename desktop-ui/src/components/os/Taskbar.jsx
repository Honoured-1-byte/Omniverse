
import React from 'react';
import useOS from '../../hooks/useOS';
import { HARBOR_APPS } from '../../config/harborRegistry.jsx';
import clsx from 'clsx';
import { Eye } from 'lucide-react';

const Taskbar = () => {
    const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow, isReptileMode, toggleReptileMode } = useOS();

    // Get unique open apps (if multiple instances, maybe show just one icon or grouped - keeping simple for now)
    // Actually, taskbar usually shows OPEN windows.
    // Let's just show icons for open windows.

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black/30 border border-white/10 p-2 rounded-full flex gap-3 backdrop-blur-2xl shadow-2xl hover:bg-black/40 transition-colors duration-300">
                {HARBOR_APPS.map(app => {
                    // Check if this app has any open windows
                    const openInstance = windows.find(w => w.appId === app.id);
                    const isActive = activeWindowId === openInstance?.id && !openInstance?.isMinimized;

                    // FILTER: Show only if Pinned OR Open
                    const PINNED_APPS = ['omnibrain', 'terminal', 'notes', 'music', 'omnicam', 'resume', 'about'];
                    if (!PINNED_APPS.includes(app.id) && !openInstance) {
                        return null;
                    }

                    return (
                        <button
                            key={app.id}
                            onClick={() => {
                                if (openInstance) {
                                    if (isActive) minimizeWindow(openInstance.id);
                                    else {
                                        if (openInstance.isMinimized) restoreWindow(openInstance.id);
                                        else focusWindow(openInstance.id);
                                    }
                                } else {
                                    openWindow(app);
                                }
                            }}
                            className={clsx(
                                "p-3 rounded-full transition-all relative group duration-300",
                                isActive
                                    ? "bg-white/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/20 scale-110"
                                    : "hover:bg-white/10 text-white/70 hover:text-white border border-transparent hover:border-white/10 hover:scale-110 hover:-translate-y-1"
                            )}
                            title={app.title}
                        >
                            {app.icon}
                            {/* Dot indicator for open apps */}
                            {openInstance && (
                                <div className={clsx(
                                    "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                                    openInstance.isMinimized ? "bg-slate-500" : "bg-cyan-400"
                                )} />
                            )}
                        </button>
                    );
                })}

                {/* Separator */}
                <div className="w-px bg-slate-700/50 my-2" />

                {/* Reptile Toggle */}
                <button
                    onClick={toggleReptileMode}
                    className={clsx(
                        "p-3 rounded-full transition-all relative group duration-300",
                        isReptileMode
                            ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-green-500/30"
                            : "hover:bg-white/10 text-white/50 hover:text-green-400 border border-transparent"
                    )}
                    title="Toggle Reptile Mode"
                >
                    <Eye size={20} />
                </button>
            </div>
        </div>
    );
};

export default Taskbar;
