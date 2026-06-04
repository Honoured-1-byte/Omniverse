import React from 'react';
import { Globe, Terminal, StickyNote, Video, Mic, Brain, Gamepad2, Image, ShoppingBag, MessageCircle, Crown, Grid3x3, Bell, Sparkles, Music, Bot, Camera, User, Plane } from 'lucide-react';
import OmniBrain from '../components/OmniBrain/OmniBrain';

import TerminalApp from '../components/apps/Terminal';
import OmniCam from '../components/apps/OmniCam';
import ResumeViewer from '../components/apps/ResumeViewer';
import AboutMe from '../components/apps/AboutMe';
import OmniWeb from '../components/apps/OmniWeb';

// This registry maps "Apps" to their content.
// type: 'harbor' = External Iframe (Live URL)
// type: 'component' = Internal React Component

export const HARBOR_APPS = [
    // --- NATIVE OS APPS ---
    {
        id: 'about',
        title: 'About Me',
        icon: <User size={24} />,
        type: 'component',
        component: <AboutMe />,
        width: 900,
        height: 700
    },
    {
        id: 'resume',
        title: 'My Profile',
        icon: <Image size={24} />, // Changed back to Image for Resume to distinguish
        type: 'component',
        component: <ResumeViewer />,
        width: 1000,
        height: 800
    },
    {
        id: 'omniweb',
        title: 'OmniWeb',
        icon: <Globe size={24} />,
        type: 'component',
        component: <OmniWeb />,
        width: 1024,
        height: 768
    },
    {
        id: 'notes',
        title: 'OmniNotes',
        icon: <StickyNote size={24} />,
        type: 'harbor',
        url: '/apps/notepad/index.html'
    },
    {
        id: 'omnicam',
        title: 'OmniCam',
        icon: <Camera size={24} />,
        type: 'component',
        component: <OmniCam />
    },
    {
        id: 'omnibrain',
        title: 'OmniBrain',
        icon: <Brain size={24} />,
        type: 'component',
        component: <OmniBrain />
    },
    {
        id: 'terminal',
        title: 'Terminal',
        icon: <Terminal size={24} />,
        type: 'component',
        component: <TerminalApp />
    },
    {
        id: 'chess',
        title: 'Chess',
        icon: <Crown size={24} />,
        type: 'harbor',
        url: '/apps/games/chess/index.html'
    },
    {
        id: 'tictactoe',
        title: 'Tic-Tac-Toe',
        icon: <Grid3x3 size={24} />,
        type: 'harbor',
        url: '/apps/games/tic-tac-toe/index.html'
    },
    {
        id: 'music',
        title: 'Spotify',
        icon: <Music size={24} />,
        type: 'harbor',
        url: '/apps/music-player/Spotify/index.html'
    },
    {
        id: 'simon',
        title: 'Simon Says',
        icon: <Bell size={24} />,
        type: 'harbor',
        url: '/apps/games/simon/index.html'
    },
    {
        id: 'particles',
        title: 'Magic Hand',
        icon: <Sparkles size={24} />,
        type: 'harbor',
        url: '/apps/games/Particle_swarm/index.html'
    },

    // --- HARBORED LIVE PROJECTS ---

    {
        id: 'council',
        title: 'C.O.I.N.',
        icon: <Bot size={24} />,
        type: 'harbor',
        url: 'https://council-of-llms.vercel.app'
    },
    {
        id: 'podcast',
        title: 'Podcast Gen',
        icon: <Mic size={24} />,
        type: 'harbor',
        url: 'https://podcast-generator.render.com'
    },
    {
        id: 'blog',
        title: 'Tech Blog',
        icon: <Globe size={24} />,
        type: 'harbor',
        url: 'https://akashic-records-er1h.onrender.com/'
    },
    {
        id: 'cinema',
        title: 'Cinema UI',
        icon: <Video size={24} />,
        type: 'harbor',
        url: '/apps/cinema/netflix-clone/index.html'
    }
];
