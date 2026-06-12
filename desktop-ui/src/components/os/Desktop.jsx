import React from 'react';
import AppGrid from './AppGrid';
import WindowFrame from './WindowFrame';
import Taskbar from './Taskbar';
import ReptileCursor from './ReptileCursor';
import useOS from '../../hooks/useOS';


const Desktop = () => {
    const { windows, isReptileMode } = useOS();

    return (
        <div className="relative h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">

            {/* 1. BACKGROUND / WALLPAPER */}
            {/* Tries to load from public/wallpaper.jpg. If missing, shows gradient. */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-black pointer-events-none" />
            <div
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-80"
                style={{ backgroundImage: `url('/magical-waterfall-moonlight.jpg')` }}
            />

            {/* 2. DESKTOP ICONS */}
            <div className="absolute inset-0 z-0 p-4">
                <AppGrid />
            </div>

            {/* 3. WINDOW LAYER */}
            <div className="absolute inset-0 bottom-24 z-10 pointer-events-none">
                {/* Windows Layer - pointer-events-none on container, windows interact individually */}
                <div className="w-full h-full">
                    {windows.map(win => (
                        <WindowFrame key={win.id} window={win} />
                    ))}
                </div>
            </div>

            {/* 4. TASKBAR */}
            <Taskbar />

            {/* 5. OVERLAYS */}
            {isReptileMode && <ReptileCursor />}

        </div>
    );
};

export default Desktop;
