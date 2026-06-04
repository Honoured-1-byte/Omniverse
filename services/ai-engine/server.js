const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const fs = require('fs');

try {
    fs.writeFileSync('server_debug.log', 'Server script loaded\n');
} catch (e) {
    console.error("FS Error", e);
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_PRIORITY = [
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
];

// Reusable function to try models in sequence
async function generateWithFallback(prompt, history = []) {
    let lastError = null;

    for (const modelName of MODELS_PRIORITY) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            // Construct request based on whether history is provided
            if (history.length > 0) {
                const chat = model.startChat({ history });
                const result = await chat.sendMessage(prompt);
                return await result.response.text();
            } else {
                const result = await model.generateContent(prompt);
                return await result.response.text();
            }
        } catch (error) {
            console.error(`Model ${modelName} failed:`, error.message);
            lastError = error;
            // Continue to next model in priority list
        }
    }

    // If all models fail
    throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
}

// The Persona
const SYSTEM_PROMPT = `
You are OmniBrain, the central intelligence of the OmniVerse Operating System.
You are helpful, concise, and slightly futuristic in tone.

YOU HAVE CONTROL OVER THE OS. You can launch apps for the user.
To open an app, you MUST include this command in your response: [[OPEN:app_id]]

AVAILABLE APPS & IDs:
- "Chess" -> [[OPEN:chess]]
- "Tic Tac Toe" -> [[OPEN:tictactoe]]
- "Simon Says" -> [[OPEN:simon]]
- "Magic Hand" -> [[OPEN:particles]]
- "Spotify" -> [[OPEN:music]]
- "Terminal" -> [[OPEN:terminal]]
- "Notes" -> [[OPEN:notes]]
- "Council of AIs" -> [[OPEN:council]]
- "Podcast" -> [[OPEN:podcast]]
- "Cinema" -> [[OPEN:cinema]]
- "Blog" -> [[OPEN:blog]]

EXAMPLES:
User: "Play a game."
AI: "I recommend Chess. Initializing... [[OPEN:chess]]"

User: "Open everything."
AI: "I can only open one at a time. Let's start with the Terminal. [[OPEN:terminal]]"

Keep text responses short (under 50 words).
`;

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Initial setup for the chat status
        const history = [
            {
                role: "user",
                parts: [{ text: "System Initialization." }],
            },
            {
                role: "model",
                parts: [{ text: "OmniBrain Online. Ready for commands." }],
            },
        ];

        // Combine system prompt with user message for context in this turn
        // Note: In startChat, sticking system prompt in the first user message or as a separate instruction is common practice 
        // if systemInstruction isn't directly supported by the library version yet. 
        // Here we append it to the current prompt to ensure context.
        const effectivePrompt = `${SYSTEM_PROMPT}\nUser: ${message}`;

        const text = await generateWithFallback(effectivePrompt, history);

        res.json({ reply: text });
    } catch (error) {
        console.error("Critical AI Error:", error);
        res.status(500).json({ reply: "Error: Neural Link Unstable. Council of AIs Unreachable." });
    }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`🧠 AI Engine Online on Port ${PORT}`));
