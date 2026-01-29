# Mobile Remote Desktop

A lightweight remote desktop solution for controlling your PC from a mobile device. View your screen and control mouse, keyboard, and clipboard through a mobile web browser.

## Features

- Real-time screen capture with hash-based change detection
- Mouse control (move, click, scroll, drag)
- Keyboard input
- Clipboard sync
- WebSocket support for low-latency communication

## Project Structure

```
mobile-remote-desktop/
├── server/          # Python/FastAPI backend
│   ├── main.py
│   ├── routes/      # API endpoints
│   └── core/        # Shared state & config
└── web/             # React/TypeScript frontend
    ├── src/
    └── public/
```

## Tech Stack

**Server:**
- Python 3.10+
- FastAPI + Uvicorn
- mss (screen capture)
- pyautogui (input control)
- pyperclip (clipboard)

**Web Client:**
- React 18
- TypeScript
- Vite

## Quick Start

### Server

```bash
cd server
pip install -r requirements.txt
python main.py
```

Server runs on `http://0.0.0.0:6485`

### Web Client

```bash
cd web
npm install
npm run dev
```

Open the dev server URL on your mobile device (ensure both devices are on the same network).

## API Overview

| Endpoint | Description |
|----------|-------------|
| `GET /screen-size` | Get screen dimensions |
| `GET /capture` | Capture screen (supports area, quality, resize params) |
| `POST /mouse/move` | Move cursor |
| `POST /mouse/{button}/{action}` | Mouse button actions |
| `POST /mouse/scroll` | Scroll |
| `POST /key/{key}` | Press key |
| `POST /text/{text}` | Type text |
| `GET/POST /clipboard` | Get/set clipboard |
| `WS /ws` | WebSocket endpoint |

See `server/CLAUDE.md` for full API documentation.

## License

MIT
