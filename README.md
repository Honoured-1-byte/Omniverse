# OmniVerse 🌌

A modular, client-side "OS" portfolio built with React. OmniVerse transforms the traditional portfolio experience into a fully functional desktop environment running right in your browser. It features window management, taskbars, live app harboring, and graceful mobile degradation.

## Features ✨

- **Window Management**: High-fidelity windows with drag, resize, minimize, maximize, and proper z-index stacking.
- **Live Harboring**: Apps seamlessly load deployed production URLs within secure Iframe shields.
- **Mobile Grace**: On devices under 768px, the OS metaphor automatically switches to a responsive App Launcher UI for optimal usability.
- **Decoupled Architecture**: OmniVerse acts as a client-side OS, fetching and integrating data from decoupled microservices.

## Tech Stack 🛠️

- **Core**: React 18, Vite
- **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`
- **Animation & Interactions**: Framer Motion, `react-rnd`
- **Icons**: Lucide-React
- **State Management**: Native React Context API

## Architecture 🏗️

OmniVerse is structurally organized to simulate an OS environment:

- **Desktop (`components/os/Desktop.jsx`)**: The primary rendering environment.
- **WindowFrame (`components/os/WindowFrame.jsx`)**: Secure containers for apps, providing drag stability (Iframe trap) and window controls.
- **Taskbar (`components/os/Taskbar.jsx`)**: Real-time application switching and state monitoring.
- **OS Context (`context/OSContext.jsx`)**: Central state manager for windows (open, active, minimized, z-index).
- **Harbor Registry (`config/harborRegistry.js`)**: Maps desktop icons directly to live portfolio project deployments.

## Getting Started 🚀

1. Install dependencies across the monorepo workspace:
   ```bash
   npm install
   ```

2. Start the Desktop UI development server:
   ```bash
   npm run dev:desktop
   ```
   *The OS will boot up on `http://localhost:5173`.*

## Project Structure 📁

- `apps/desktop-ui/`: The main React client application (The OS).
- `docs/`: Technical specifications and documentation.
- `scripts/`: Useful development and maintenance scripts.
- `packages/` & `services/`: Workspaces reserved for decoupled backend services (e.g., AI integration, e-commerce engines).

---

*This project is part of a portfolio showcase aimed at demonstrating advanced frontend architecture, responsive design, and micro-frontend integration techniques.*
