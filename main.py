from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pyautogui

from routes import (
    screen_size,
    capture_area,
    capture,
    capture_new_only,
    capture_full,
    mouse_position,
    mouse_move,
    mouse_button,
    mouse_scroll,
    key_press,
    clipboard,
    shutdown,
)
from core.config import PORT

app = FastAPI(title="Mobile Remote Desktop Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Disable pyautogui failsafe
pyautogui.FAILSAFE = False

# Register routers
app.include_router(screen_size.router)
app.include_router(capture_area.router)
app.include_router(capture.router)
app.include_router(capture_new_only.router)
app.include_router(capture_full.router)
app.include_router(mouse_position.router)
app.include_router(mouse_move.router)
app.include_router(mouse_button.router)
app.include_router(mouse_scroll.router)
app.include_router(key_press.router)
app.include_router(clipboard.router)
app.include_router(shutdown.router)

if __name__ == "__main__":
    import uvicorn
    print(f"Mobile Remote Desktop Server running on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
