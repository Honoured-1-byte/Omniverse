import React, { useState, useEffect } from 'react';
import useSound from '../../hooks/useSound';
import { Loader2 } from 'lucide-react';

const BiosBoot = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing Kernel...");
    const [hasInteracted, setHasInteracted] = useState(false);
    const { playBootSound } = useSound();

    useEffect(() => {
        if (!hasInteracted) return;

        playBootSound();

        const steps = [
            { pct: 10, text: "Loading Core Modules..." },
            { pct: 30, text: "Mounting File System..." },
            { pct: 50, text: "Connecting to Neural Link..." },
            { pct: 70, text: "Restoring User Preferences..." },
            { pct: 90, text: "Starting Desktop Environment..." },
            { pct: 100, text: "Welcome." }
        ];

        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep >= steps.length) {
                clearInterval(interval);
                setTimeout(onComplete, 800);
                return;
            }

            const step = steps[currentStep];
            setProgress(step.pct);
            setStatus(step.text);
            currentStep++;
        }, 600); // Adjust speed here

        return () => clearInterval(interval);

    }, [onComplete, hasInteracted]);

    if (!hasInteracted) {
        return (
            <div
                className="fixed inset-0 bg-black z-[9999] flex items-center justify-center cursor-pointer"
                onClick={() => setHasInteracted(true)}
            >
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 blur-lg absolute opacity-50"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 relative flex items-center justify-center border border-white/10 z-10">
                        <span className="text-xl font-bold text-white">OV</span>
                    </div>
                    <div className="text-white/60 font-sans text-sm tracking-widest mt-4">
                        CLICK TO BOOT
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-950 z-[9999] flex flex-col items-center justify-center select-none bg-[url('/magical-waterfall-moonlight.jpg')] bg-cover bg-center">
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

            <div className="relative z-10 flex flex-col items-center gap-8 w-64">
                {/* Logo Area */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 blur-xl absolute -inset-2 opacity-60 animate-pulse"></div>
                    <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center relative shadow-2xl">
                        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">OV</span>
                    </div>
                </div>

                {/* Loading Bar */}
                <div className="w-full space-y-2">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyan-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/50 font-medium font-mono h-4">
                        <span>{status}</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 text-white/20 text-[10px] tracking-[0.2em] font-light">
                OMNIVERSE OS © 2026
            </div>
        </div>
    );
};

export default BiosBoot;
