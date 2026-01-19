# Mobile Remote Desktop Web Client Design

This application is to let user to remote connection to his desktop from his mobile phone.

## Architecture Overview

 The application follows a **Feature-Based Architecture**. Code is organized by domain (Screen, Mouse, Input) rather than technical role (components, utils, hooks).

### Directory Structure
```
src/
├── screen/
├── mouse/
├── keyboard/
├── clipboard/
├── server.ts
└── App.tsx
```

---

## Server Side

Server side is well writen in "../mobile-remote-desktop-server". Read [CLAUDE.md](../mobile-remote-desktop-server/CLAUDE.md) there for API details.

## Implementation Approach

We should develop the app stage by stage. In each stage, we should focus on one feature and make it work first.