# OmniVerse — Architecture Diagrams

> **Last Updated:** June 2026 — Reflects current architecture (shop, social, and travel engines decommissioned).

---

## Diagram 1 — System Component / Architecture Diagram

```mermaid
graph TD
    subgraph CLIENT["🖥️ apps/desktop-ui (React + Vite :5173)"]
        direction TB
        BOOT["BiosBoot.jsx\n(Splash / BIOS animation)"]
        APP["App.jsx\n(Root — Responsive Gate\n≥768px → OS | <768px → MobileLauncher)"]
        OSPROVIDER["OSContext.jsx\n(Global Window State Manager\nopenWindow · closeWindow\nminimize · focus · zIndex)"]
        HARBOR["harborRegistry.jsx\n(App Registry — type: component | harbor)"]
        DESKTOP["Desktop.jsx"]
        APPGRID["AppGrid.jsx\n(Icon Launcher)"]
        TASKBAR["Taskbar.jsx\n(Running Windows Bar)"]
        WINFRAME["WindowFrame.jsx\n(Draggable Container\n+ Iframe Shield)"]

        subgraph NATIVE_APPS["Native React Components (type: component)"]
            OMNIBRAIN_UI["OmniBrain.jsx\n(AI Chat + [[OPEN:]] Parser)"]
            TERMINAL["Terminal.jsx"]
            OMNIWEB["OmniWeb.jsx\n(In-OS Browser)"]
            OMNICAM["OmniCam.jsx"]
            ABOUTME["AboutMe.jsx"]
            RESUME["ResumeViewer.jsx"]
        end

        subgraph HARBOR_APPS["Harbored iFrame Apps (type: harbor)"]
            STATIC["Static HTML Apps\n/apps/games/chess\n/apps/games/simon\n/apps/games/tic-tac-toe\n/apps/music-player/Spotify\n/apps/cinema/netflix-clone\n/apps/notepad"]
            LIVE["Live External Projects\nC.O.I.N. (vercel.app)\nPodcast Gen (render.com)\nAkashic Records Blog (onrender.com)"]
        end

        BOOT --> APP
        APP --> OSPROVIDER
        OSPROVIDER --> HARBOR
        HARBOR --> DESKTOP
        DESKTOP --> APPGRID
        DESKTOP --> TASKBAR
        DESKTOP --> WINFRAME
        WINFRAME --> NATIVE_APPS
        WINFRAME --> HARBOR_APPS
    end

    subgraph AI_ENGINE["🧠 services/ai-engine (Express :3004)"]
        direction TB
        AI_ROUTE["POST /chat"]
        FALLBACK["generateWithFallback()\nModel Priority Queue:\ngemini-3-flash-preview → 2.5-pro\n→ 2.5-flash → 2.5-flash-lite"]
        SYS_PROMPT["SYSTEM_PROMPT\n(OmniBrain Persona +\n[[OPEN:app_id]] Command Protocol)"]
        AI_ROUTE --> SYS_PROMPT
        AI_ROUTE --> FALLBACK
    end

    subgraph GEMINI["🤖 Google Gemini API"]
        GEMINI_MODELS["gemini-3-flash-preview\ngemini-2.5-pro\ngemini-2.5-flash\ngemini-2.5-flash-lite"]
    end

    OMNIBRAIN_UI -- "POST /chat (JSON)" --> AI_ROUTE
    FALLBACK -- "SDK: generateContent()" --> GEMINI_MODELS
    GEMINI_MODELS -- "text + [[OPEN:id]]" --> FALLBACK
    FALLBACK -- "{ reply: text }" --> OMNIBRAIN_UI
    OMNIBRAIN_UI -- "parseCommand([[OPEN:id]])\ncalls openWindow()" --> OSPROVIDER
```

---

## Diagram 2 — Sequence Diagram: OmniBrain Command → App Launch

> **Critical User Action:** User asks OmniBrain to open an app → AI Engine returns a `[[OPEN:chess]]` command → client parses it → `WindowFrame` mounts the Chess app.

```mermaid
sequenceDiagram
    actor User
    participant UI as OmniBrain.jsx
    participant CTX as OSContext.jsx
    participant REG as harborRegistry.jsx
    participant AI as ai-engine :3004
    participant GEM as Google Gemini API
    participant WF as WindowFrame.jsx

    User->>UI: Types "Play chess."
    UI->>UI: setState({ isLoading: true })
    UI->>AI: POST /chat { message: "Play chess." }

    Note over AI: Prepends SYSTEM_PROMPT<br/>with [[OPEN:]] protocol rules<br/>and available app IDs

    AI->>GEM: generateContent(SYSTEM_PROMPT + message)<br/>Priority: gemini-3-flash-preview first
    GEM-->>AI: "Initializing Chess. [[OPEN:chess]]"
    AI-->>UI: { reply: "Initializing Chess. [[OPEN:chess]]" }

    UI->>UI: parseCommand(reply)<br/>Regex match → appId = "chess"

    UI->>REG: find(app => app.id === "chess")
    REG-->>UI: { id:'chess', type:'harbor',<br/>url:'/apps/games/chess/index.html' }

    UI->>CTX: openWindow(chessApp)
    CTX->>CTX: windows.find(w => w.appId === 'chess') → null
    CTX->>CTX: setState: push newWindow entry<br/>zIndexCounter++ · activeWindowId = id

    CTX-->>WF: Re-render trigger — new WindowFrame mounts<br/>(Framer Motion entrance animation)

    WF->>WF: type === 'harbor'<br/>render <iframe src="/apps/games/chess/index.html">
    WF-->>User: Chess game rendered inside OS Window

    UI->>UI: Display cleaned reply (no [[OPEN:...]])<br/>setState({ isLoading: false })
```

---

## Architectural Bottleneck Analysis

### ⚠️ Bottleneck 1 — AI Engine: Stateless, Amnesiac Chat History

**What the interviewer will say:**
> *"Your `generateWithFallback()` reinitializes `history` on every POST request. OmniBrain has zero memory — it can't recall previous conversation turns."*

**Your defense:**
This is a deliberate trade-off for **stateless horizontal scalability**. Since each request is self-contained, the AI Engine can run as N identical instances behind a load balancer with zero session-stickiness — architecturally superior for a demo. The production fix is clean: on the first request, the server generates a `sessionId` UUID returned to the client. On subsequent requests, the client sends it back as a header. The server uses this as a **Redis key** (TTL-keyed, ~30 min) to store and retrieve the conversation history array. OmniBrain's primary role is **command dispatch** — single-turn context is sufficient for V1, making this deferred debt, not an oversight.

---

### ⚠️ Bottleneck 2 — harborRegistry: JSX Module-Level Instantiation

**What the interviewer will say:**
> *"You're instantiating `component: <OmniBrain />` at module load time. Every window shares the same singleton component instance — any internal state is shared across all open windows of the same app."*

**Your defense:**
Acknowledged. The correct pattern is to store a component reference without JSX: `component: OmniBrain` (no angle brackets), and have `WindowFrame` instantiate it as `<app.component />`. This ensures each window receives a fresh, isolated component instance. The current implementation works for the portfolio because each native app is only opened once, but the fix is a one-character change per registry entry and is the production-correct approach.

---

### ⚠️ Bottleneck 3 — OSContext: iFrame Harbor Security Model

**What the interviewer will say:**
> *"You're embedding third-party URLs — `vercel.app`, `render.com` — in raw iframes. A malicious harbored app could attempt top-frame navigation or script injection."*

**Your defense:**
Acknowledged — this is a known, accepted risk in the portfolio/demo context. The mitigations are well-defined and partially implemented: `sandbox="allow-scripts allow-same-origin allow-forms"` on each `<iframe>` prevents top-frame navigation and popup spawning. A **Content Security Policy (CSP)** header on the Vite server (`frame-ancestors 'self'`) and `X-Frame-Options: SAMEORIGIN` on harbored services complete the hardening. The **Harbor Registry pattern itself is architecturally sound** — the missing piece is the `sandbox` attribute, which is a two-line fix. The iframe shield div already exists for drag stability; it doubles as a UX safety layer preventing accidental clicks on harbor content during OS interactions.
