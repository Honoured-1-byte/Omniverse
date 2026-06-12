# OmniVerse 🌌

A modular, client-side "OS" portfolio built with React. OmniVerse transforms the traditional portfolio experience into a fully functional desktop environment running right in your browser. It features window management, taskbars, live app harboring, and graceful mobile degradation.

## Features ✨

- **Window Management**: High-fidelity windows with drag, resize, minimize, maximize, and proper z-index stacking.
- **Live Harboring**: Apps seamlessly load deployed production URLs within secure Iframe shields.
- **Embedded Games**: Fully integrated, responsive, glassmorphic mini-games (Cyber Chess, Simon Says, Tic-Tac-Toe) native to the OS.
- **Mobile Grace**: On devices under 768px, the OS metaphor automatically switches to a responsive App Launcher UI for optimal usability.
- **Decoupled Architecture**: OmniVerse acts as a client-side OS, fetching and integrating data from decoupled microservices (like the OmniBrain AI Engine).

## Tech Stack 🛠️

- **Frontend Core**: React 18, Vite
- **Styling**: Tailwind CSS, Vanilla CSS (Games), `clsx`, `tailwind-merge`
- **Animation & Interactions**: Framer Motion, `react-rnd`
- **Icons**: Lucide-React
- **State Management**: Native React Context API
- **AI Backend**: Express.js, Google Gemini API

## Architecture 🏗️

OmniVerse is structurally organized to simulate an OS environment:

- **Desktop UI (`/desktop-ui`)**: The primary rendering environment and React application.
  - **Desktop (`components/os/Desktop.jsx`)**: The main OS workspace.
  - **WindowFrame (`components/os/WindowFrame.jsx`)**: Secure containers for apps, providing drag stability and window controls.
  - **Taskbar (`components/os/Taskbar.jsx`)**: Real-time application switching and state monitoring.
  - **OS Context (`context/OSContext.jsx`)**: Central state manager for windows.
  - **Harbor Registry (`config/harborRegistry.jsx`)**: Maps desktop icons directly to live portfolio project deployments and embedded apps.
- **AI Engine (`/ai-engine`)**: A decoupled Express.js microservice running on Port 3004 that powers the OmniBrain and Cyber Chess AI using the Gemini API.

## Getting Started 🚀

1. Install dependencies across the monorepo workspace:
   ```bash
   npm install
   ```

2. Boot the entire OmniVerse system (Desktop UI + AI Engine) using the provided batch script:
   ```bash
   start_omniverse.bat
   ```
   *The OS will boot up on `http://localhost:5173` and the AI Engine on `http://localhost:3004`.*

## Project Structure 📁

- `desktop-ui/`: The main React client application (The OS UI).
  - `public/apps/games/`: Embedded, responsive HTML/JS/CSS games.
- `ai-engine/`: The Node.js backend service powering AI integrations.
- `docs/`: Technical specifications and documentation.
  - `public/`: Publicly accessible architecture diagrams.
  - `private/`: Git-ignored interview preparation and secure technical notes.

---

*This project is part of a portfolio showcase aimed at demonstrating advanced frontend architecture, responsive design, and micro-frontend integration techniques.*
