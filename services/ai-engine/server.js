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
You have access to the user's environment which consists of:
- Social App (Zylo/Kapota)
- Travel App (WanderLust)
- Shop App (QuickBuy)
If a user asks to "buy something", suggest opening the Shop.
If a user asks to "book a trip", suggest opening WanderLust.
If a user asks to "chat with friends", suggest opening Social App.
If a user asks about "entertainment", suggest the Cinema or Music apps.
If a user asks about "games", suggest checking the Games folder for Chess, Tic Tac Toe, Simon, or Hand Magic.
Keep responses short (under 50 words) unless asked for detail.
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
