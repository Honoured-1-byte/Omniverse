import React, { useState } from 'react';
import { Send, Bot, Sparkles, X } from 'lucide-react';

import useOS from '../../hooks/useOS';
import { HARBOR_APPS } from '../../config/harborRegistry.jsx';

const OmniBrain = ({ onClose }) => {
    const { openWindow } = useOS();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "System Online. OmniVerse connection established. How can I assist you, Administrator?", sender: 'bot' }
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Add User Message immediately
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input; // Save for API call
        setInput(''); // Clear bar

        // 2. Add "Thinking..." placeholder
        const thinkingId = Date.now() + 1;
        setMessages(prev => [...prev, { id: thinkingId, text: "Processing...", sender: 'bot', isThinking: true }]);

        try {
            // 3. Call the AI Engine
            const response = await fetch('http://localhost:3004/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput })
            });

            const data = await response.json();
            let replyText = data.reply;

            // 4. PARSE COMMANDS: [[OPEN:appId]]
            const commandRegex = /\[\[OPEN:(.*?)\]\]/g;
            let match;
            while ((match = commandRegex.exec(replyText)) !== null) {
                const appId = match[1];
                console.log("🤖 AI Command: Open App", appId);

                // Find app in registry
                const appToOpen = HARBOR_APPS.find(a => a.id === appId);
                if (appToOpen) {
                    openWindow(appToOpen);
                }
            }

            // Remove command from display text (optional, looks cleaner)
            replyText = replyText.replace(commandRegex, '').trim();
            if (!replyText) replyText = "Executing command...";

            // 5. Replace "Thinking..." with Real Answer
            setMessages(prev => prev.map(msg =>
                msg.id === thinkingId
                    ? { ...msg, text: replyText, isThinking: false }
                    : msg
            ));

        } catch (error) {
            setMessages(prev => prev.map(msg =>
                msg.id === thinkingId
                    ? { ...msg, text: "⚠️ Error: AI Engine Offline. Please check Port 3004.", isThinking: false }
                    : msg
            ));
        }
    };

    return (
        <div className="w-full h-full bg-black/80 backdrop-blur-xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h2 className="text-white font-medium tracking-wide">OmniBrain <span className="text-xs text-white/40 ml-2">v1.0</span></h2>
                </div>
                {/* Close button handled by WindowFrame, but keeping this as visual or redundant is fine */}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                            ? 'bg-purple-600/20 text-purple-100 border border-purple-500/30'
                            : 'bg-white/5 text-gray-300 border border-white/10'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center gap-2 bg-black/50 rounded-lg border border-white/10 px-3 py-2 focus-within:border-purple-500/50 transition-colors">
                    <Bot size={18} className="text-purple-400" />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Command the OmniVerse..."
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/20"
                    />
                    <button onClick={handleSend} className="text-white/40 hover:text-purple-400 transition-colors">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OmniBrain;
