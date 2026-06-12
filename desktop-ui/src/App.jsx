import React, { useState, useEffect } from 'react';
import { OSProvider } from './context/OSContext';
import Desktop from './components/os/Desktop';
import MobileLauncher from './components/os/MobileLauncher';

import BiosBoot from './components/os/BiosBoot';

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isBooting, setIsBooting] = useState(true); // START WITH BOOT

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Mobile View (No Boot for now, or maybe later)
    if (isMobile) {
        return <MobileLauncher />;
    }

    // 2. Boot Sequence
    if (isBooting) {
        return <BiosBoot onComplete={() => setIsBooting(false)} />;
    }

    // 3. Desktop OS
    return (
        <OSProvider>
            <Desktop />
            {/* F11 Toast Hint */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white/70 px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 pointer-events-none animate-[fadeOut_5s_forwards_2s]">
                Press F11 for Full Immersion
            </div>
            <style>{`
                @keyframes fadeOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </OSProvider>
    );
}

export default App;
