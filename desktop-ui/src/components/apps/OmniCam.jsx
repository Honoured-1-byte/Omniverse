import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

const OmniCam = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            setError("Camera access denied or unavailable.");
            console.error("Camera Error:", err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {error ? (
                <div className="text-red-400 flex flex-col items-center">
                    <Camera size={48} className="mb-2 opacity-50" />
                    <p>{error}</p>
                    <button onClick={startCamera} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700">
                        Retry
                    </button>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
            )}

            {/* UI Overlay */}
            <div className="absolute bottom-6 flex gap-6 items-center z-10">
                <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform active:scale-95 bg-white/20 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                </div>
            </div>

            {/* Corner Indicators */}
            <div className="absolute top-4 right-4 text-xs text-white/50 font-mono">REC ●</div>
        </div>
    );
};

export default OmniCam;
