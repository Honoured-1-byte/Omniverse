import { useEffect } from 'react';

const useSound = () => {

    // Preload critical sounds
    const bootAudio = new Audio('/dark-mystery-intro-398656.mp3');
    bootAudio.volume = 0.4;

    const playBootSound = () => {
        bootAudio.currentTime = 0;
        bootAudio.play().catch(err => console.error("Audio block:", err));
    };

    const playClickSound = () => {
        // Simple synth click to avoid loading more files for now
        // We could add a 'click.mp3' later if user provides it
    };

    return { playBootSound };
};

export default useSound;
