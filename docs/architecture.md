# Architecture & Laws

## Non-Negotiable Laws

### 1. The Immutable Archive
- Content within `/static-archive` is READ-ONLY for development purposes.
- Never fix bugs in the archive. If you reuse code, copy it to a new active package.
- The archive exists to preserve history, not to be maintained.

### 2. Package Dependencies
- **Apps** (`/apps`, `/services`) can depend on **Packages** (`/packages`).
- **Packages** cannot depend on **Apps**.
- **Services** should remain loosely coupled.
- **UI Kit** (`packages/ui-kit`) must be framework-agnostic or clearly scoped (e.g., React specifics only).

### 3. Monorepo Structure
- **apps/**: User-facing applications (web, desktop, mobile).
- **services/**: Backend microservices and APIs.
- **packages/**: Shared libraries (auth, db schemas, ui components).
- **static-archive/**: Graveyard of old projects.
