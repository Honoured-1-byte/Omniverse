
import React, { createContext, useContext, useState, useEffect } from 'react';

const OSContext = createContext();

export const OSProvider = ({ children }) => {
    // State
    const [windows, setWindows] = useState([]); // [{ id, appId, title, isMinimized, zIndex }]
    const [activeWindowId, setActiveWindowId] = useState(null);
    const [zIndexCounter, setZIndexCounter] = useState(100);
    const [isReptileMode, setIsReptileMode] = useState(false);

    // Actions
    const toggleReptileMode = () => setIsReptileMode(prev => !prev);

    const openWindow = (app) => {
        // Check if already open
        const existing = windows.find(w => w.appId === app.id);
        if (existing) {
            focusWindow(existing.id);
            if (existing.isMinimized) {
                restoreWindow(existing.id);
            }
            return;
        }

        // Create new window
        const newWindow = {
            id: Date.now().toString(), // Unique instance ID
            appId: app.id,
            title: app.title,
            type: app.type,
            url: app.url,
            component: app.component,
            isMinimized: false,
            zIndex: zIndexCounter + 1
        };

        setZIndexCounter(prev => prev + 1);
        setWindows(prev => [...prev, newWindow]);
        setActiveWindowId(newWindow.id);
    };

    const closeWindow = (id) => {
        setWindows(prev => prev.filter(w => w.id !== id));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    };

    const minimizeWindow = (id) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: true } : w
        ));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    };

    const restoreWindow = (id) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: false } : w
        ));
        focusWindow(id);
    };

    const focusWindow = (id) => {
        const win = windows.find(w => w.id === id);
        if (!win || win.zIndex === zIndexCounter) return;

        setZIndexCounter(prev => prev + 1);
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w
        ));
        setActiveWindowId(id);
    };

    return (
        <OSContext.Provider value={{
            windows,
            activeWindowId,
            openWindow,
            closeWindow,
            minimizeWindow,
            restoreWindow,
            focusWindow,
            isReptileMode,
            toggleReptileMode
        }}>
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => useContext(OSContext);
