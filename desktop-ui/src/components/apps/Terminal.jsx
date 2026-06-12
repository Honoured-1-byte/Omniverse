import React, { useState, useEffect, useRef } from 'react';

const Terminal = () => {
    const [history, setHistory] = useState([
        "OmniVerse OS Kernel v1.0.4",
        "Type 'help' for a list of commands."
    ]);
    const [currentLine, setCurrentLine] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const parts = cmd.trim().split(' ');
        const main = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        let output = "";

        switch (main) {
            case 'help':
                output = "Available commands: help, clear, echo, date, whoami, ls, skills, projects, contact";
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'echo':
                output = args;
                break;
            case 'date':
                output = new Date().toString();
                break;
            case 'whoami':
                output = "Yash Seth - Full Stack Developer\nAccess Level: Administrator (Root)";
                break;
            case 'ls':
                output = "Council_of_AIs/  Akashic_Records/  EchoCast/  OmniVerse/  Documents/  Media/";
                break;
            case 'skills':
                output = "JavaScript  TypeScript  React  Node.js  MongoDB  AWS  Python  TailwindCSS";
                break;
            case 'projects':
                output = "1. OmniVerse (OS Shell)\n2. Council of AIs (Multi-Agent System)\n3. EchoCast (AI Podcast)\n4. Akashic Records (Blog)";
                break;
            case 'contact':
                output = "GitHub: github.com/Start-sys-del\nLinkedIn: linkedin.com/in/yash-seth\nEmail: contact@yashseth.dev";
                break;
            case '':
                break;
            default:
                output = `Command not found: ${main}`;
        }

        if (output) {
            setHistory(prev => [...prev, `user@omniverse:~$ ${cmd}`, output]);
        } else if (main) {
            // For empty commands or unhandled cases that didn't return
            setHistory(prev => [...prev, `user@omniverse:~$ ${cmd}`]);
        } else {
            // Just newline
            setHistory(prev => [...prev, `user@omniverse:~$ `]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(currentLine);
            setCurrentLine("");
        }
    };

    return (
        <div className="w-full h-full bg-black/90 text-green-400 font-mono p-4 overflow-y-auto text-sm" onClick={() => document.getElementById('term-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
            ))}
            <div className="flex">
                <span className="mr-2">user@omniverse:~$</span>
                <input
                    id="term-input"
                    type="text"
                    value={currentLine}
                    onChange={(e) => setCurrentLine(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none border-none text-green-400 focus:ring-0"
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default Terminal;
