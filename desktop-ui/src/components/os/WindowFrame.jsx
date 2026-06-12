import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import useOS from '../../hooks/useOS';
import { X, Minus, Square, Maximize2, ExternalLink } from 'lucide-react';
// import { motion } from 'framer-motion'; // Uncomment if framer-motion is installed

const WindowFrame = ({ window: win }) => {
    const { closeWindow, minimizeWindow, focusWindow } = useOS();
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Controlled State for Window
    const [windowState, setWindowState] = useState({
        x: win.startPos?.x || 100 + Math.random() * 50,
        y: win.startPos?.y || 50 + Math.random() * 50,
        width: win.width || 800,
        height: win.height || 600
    });

    const [isMaximized, setIsMaximized] = useState(false);
    const [preMaximizedState, setPreMaximizedState] = useState(null);

    const toggleMaximize = () => {
        if (isMaximized) {
            // Restore
            if (preMaximizedState) {
                setWindowState(preMaximizedState);
            }
            setIsMaximized(false);
        } else {
            // Maximize
            setPreMaximizedState(windowState);
            setIsMaximized(true);
        }
    };

    if (win.isMinimized) return null;

    // Derived props for Rnd
    const curX = isMaximized ? 0 : windowState.x;
    const curY = isMaximized ? 0 : windowState.y;
    const curWidth = isMaximized ? '100%' : windowState.width;
    const curHeight = isMaximized ? 'calc(100% - 48px)' : windowState.height; // Leave space for taskbar if needed, or 100%
    // Actually taskbar is usually z-indexed on top. Let's do 100% minus a safe bottom margin or just 100%. 
    // User requested "resize tab button... working".

    // Rnd props
    const disableMoves = isMaximized;

    return (
        <Rnd
            size={{ width: curWidth, height: curHeight }}
            position={{ x: curX, y: curY }}
            minWidth={320}
            minHeight={200}
            bounds="parent"
            dragHandleClassName="window-header"
            disableDragging={disableMoves}
            enableResizing={!isMaximized}

            // Sync state on updates
            onDragStop={(e, d) => {
                setWindowState(prev => ({ ...prev, x: d.x, y: d.y }));
                setIsDragging(false);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setWindowState({
                    width: ref.style.width,
                    height: ref.style.height,
                    ...position,
                });
            }}

            onDragStart={() => {
                focusWindow(win.id);
                setIsDragging(true);
            }}
            onMouseDown={() => focusWindow(win.id)}
            style={{ zIndex: win.zIndex }}
            className="flex flex-col pointer-events-auto"
        >
            <div className="flex flex-col h-full w-full bg-[#1e1e1e] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                {/* Window Header */}
                <div
                    className="window-header h-10 bg-[#2a2a2a] flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none border-b border-white/5 shrink-0"
                    onDoubleClick={toggleMaximize}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-gray-300">{win.icon}</span>
                        <span className="text-xs text-gray-300 font-medium">{win.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Spinny loader */}
                        {isLoading && win.type === 'harbor' && (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin mr-2"></div>
                        )}
                        {(win.type === 'harbor' || win.url) && (
                            <a
                                href={win.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                title="Open in Real Browser"
                            >
                                <ExternalLink size={14} />
                            </a>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                            <Minus size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); toggleMaximize(); }} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                            {isMaximized ? <Square size={10} /> : <Maximize2 size={12} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="p-1 hover:bg-red-500 rounded text-gray-400 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Window Content Area */}
                <div className="flex-1 relative w-full h-full bg-white">
                    {/* Iframe Loading Spinner Overlay */}
                    {isLoading && win.type === 'harbor' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
                                <span className="text-xs text-white/50 animate-pulse">Loading {win.title}...</span>
                            </div>
                        </div>
                    )}

                    {/* Drag Shield */}
                    {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}

                    {/* Render Content */}
                    {(win.type === 'harbor') ? (
                        <iframe
                            src={win.url}
                            className="w-full h-full border-none block"
                            title={win.title}
                            scrolling="yes"
                            onLoad={() => setIsLoading(false)}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1e1e1e] text-white overflow-auto">
                            {win.component}
                        </div>
                    )}
                </div>
            </div>
        </Rnd>
    );
};

export default WindowFrame;
