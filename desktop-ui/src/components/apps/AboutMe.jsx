import React from 'react';
import { Github, Linkedin, Mail, MapPin, Code, FileText, Globe } from 'lucide-react';
import useOS from '../../hooks/useOS';
import OmniWeb from './OmniWeb';

const AboutMe = () => {
    const { openWindow } = useOS();

    const openInOmniWeb = (e, url, title) => {
        e.preventDefault();
        openWindow({
            id: `omniweb-${Date.now()}`,
            title: title || 'OmniWeb',
            icon: <Globe size={20} />,
            type: 'component',
            // Dynamically import OmniWeb logic by using the mapped component, 
            // but we need to import OmniWeb here to pass props. 
            // Better: We see OmniWeb is not imported in AboutMe. 
            // Let's import it first in AboutMe to use it.
            // Wait, we can't easily dynamic import. 
            // Let's assume we import OmniWeb at the top.
            component: <OmniWeb startUrl={url} />,
            width: 1024,
            height: 768
        });
    };

    return (
        <div className="w-full h-full bg-slate-900 text-white overflow-y-auto p-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header / Intro */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                            {/* Placeholder for user avatar if available, else Initials */}
                            <span className="text-4xl font-bold text-cyan-400">YS</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Yash Seth
                        </h1>
                        <p className="text-xl text-slate-400 mt-1">Full Stack Developer & AI Enthusiast</p>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        <a
                            href="https://github.com/Honoured-1-byte"
                            onClick={(e) => openInOmniWeb(e, 'https://github.com/Honoured-1-byte', 'GitHub')}
                            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                            title="GitHub"
                        >
                            <Github size={20} className="text-white" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/yash-seth-9b0536351/"
                            onClick={(e) => openInOmniWeb(e, 'https://www.linkedin.com/in/yash-seth-9b0536351/', 'LinkedIn')}
                            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                            title="LinkedIn"
                        >
                            <Linkedin size={20} className="text-blue-400" />
                        </a>
                        <a
                            href="https://leetcode.com/u/Honoured_One_25/"
                            onClick={(e) => openInOmniWeb(e, 'https://leetcode.com/u/Honoured_One_25/', 'LeetCode')}
                            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                            title="LeetCode"
                        >
                            <Code size={20} className="text-yellow-500" />
                        </a>
                        <a href="mailto:yashseth880@gmail.com" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" title="Email">
                            <Mail size={20} className="text-red-400" />
                        </a>
                        <a href="/Yash_cv_9_1_26.pdf" download className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors" title="Download Resume">
                            <FileText size={20} className="text-green-400" />
                        </a>
                    </div>
                </div>

                {/* Bio */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                        About Me
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        I am a passionate developer with a knack for building immersive web experiences. I specialize in the React ecosystem and have a deep interest in Artificial Intelligence and Neural Networks.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        My goal is to bridge the gap between complex AI systems and intuitive user interfaces, creating "Agentic" applications that feel alive.
                    </p>
                </div>

                {/* Skills Grid */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-xl font-semibold mb-6 text-cyan-400">Technical Arsenal</h2>
                    <div className="flex flex-wrap gap-3">
                        {['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Python', 'TailwindCSS', 'Three.js', 'AI Integration'].map(skill => (
                            <span key={skill} className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm text-cyan-200 border border-slate-600">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Contact Info (Detailed) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-700">
                        <Mail className="text-cyan-400" />
                        <div>
                            <div className="text-xs text-slate-500">Email</div>
                            <div className="text-sm">yashseth880@gmail.com</div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-700">
                        <MapPin className="text-cyan-400" />
                        <div>
                            <div className="text-xs text-slate-500">Location</div>
                            <div className="text-sm">India</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


export default AboutMe;
