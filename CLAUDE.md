# Mobile Remote Desktop Server

A lightweight RDP-like server for mobile web clients. Built with Python/FastAPI.

## Tech Stack

- **Runtime**: Python 3.10+
- **Framework**: FastAPI with Uvicorn
- **Screen Capture**: mss
- **Input Control**: pyautogui
- **Clipboard**: pyperclip

## Project Structure

```
/
  main.py              # FastAPI app entry point, route registration
  requirements.txt     # Python dependencies
  /routes
    __init__.py
    screen_size.py     # GET /screen-size
    capture_area.py    # GET/POST /capture/area
    capture.py         # GET /capture
    capture_new_only.py # GET /capture/new-only
    capture_full.py    # GET /capture/full
    mouse_position.py  # GET /mouse/position
    mouse_move.py      # POST /mouse/move
    mouse_button.py    # POST /mouse/{button}/{action}
    mouse_scroll.py    # POST /mouse/scroll
    key_press.py       # POST /key/{key}
    clipboard.py       # GET/POST /clipboard
    shutdown.py        # POST /shutdown
  /core
    __init__.py
    state.py           # Shared state (mouse_down_timers)
    config.py          # Constants (DATA_DIR, PORT)
  /data
    area.json          # Saved capture area
    capture.png        # Last captured image
    capture-hash.txt   # Last capture hash
    screen.png         # Last full screen capture
```

## API Endpoints

### Screen Info
- `GET /screen-size` - Returns `{ width: int, height: int }`

### Capture Area
- `GET /capture/area` - Returns saved value `{ x: int, y: int, w: int, h: int }`
- `POST /capture/area` - Body: `{ x, y, w, h }` - Sets capture region
- Save into file "data/area.json"

### Screen Capture
- `GET /capture` - Returns PNG image of current capture area
- `GET /capture/new-only` - Returns PNG only if screen changed, else 204 No Content
- Read file "data/area.json"
- Save last image into "data/capture.png"
- Save last image's hash into "data/capture-hash.txt"

### Full Screen Capture
- `GET /capture/full` - Returns PNG image of current screen
- Save last image into "data/screen.png"

### Mouse Control
- `GET /mouse/position` - Returns `{ x: int, y: int }`
- `POST /mouse/move` - Body: `{ x, y }` - Moves cursor to position

### Mouse Button
- `POST /mouse/{button}/{action}` - Presses mouse button
  - eg. `POST /mouse/left/down`
  - eg. `POST /mouse/right/up`
- For down, auto-releases after 10s safety timeout if relative up is not called

### Mouse Scroll
- `POST /mouse/scroll` - Body: `{ x, y }`

### Keyboard
- `POST /key/{key}` - Presses single key (e.g., `a`, `enter`, `escape`)

### Clipboard
- `GET /clipboard` - Returns `{ text: str }` with current clipboard content
- `POST /clipboard` - Body: `{ text: str }` - Sets clipboard content

### Shutdown
- `POST /shutdown` - Gracefully shutdown server
- Release mouse buttons

## Code Structure

### core/config.py
```python
import os

DATA_DIR = "data"
PORT = 6485

os.makedirs(DATA_DIR, exist_ok=True)
```

### core/state.py
```python
import threading

mouse_down_timers: dict[str, threading.Timer] = {}
```

### main.py
```python
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

app = FastAPI()

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
    uvicorn.run(app, host="0.0.0.0", port=PORT)
```

### routes/screen_size.py
```python
from fastapi import APIRouter
import pyautogui

router = APIRouter()

@router.get("/screen-size")
def screen_size():
    size = pyautogui.size()
    return {"width": size.width, "height": size.height}
```

### routes/capture_area.py
```python
from fastapi import APIRouter
from pydantic import BaseModel
import pyautogui
import json
import os

from core.config import DATA_DIR

router = APIRouter()

class Area(BaseModel):
    x: int
    y: int
    w: int
    h: int

def get_area() -> dict:
    path = os.path.join(DATA_DIR, "area.json")
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    size = pyautogui.size()
    return {"x": 0, "y": 0, "w": size.width, "h": size.height}

@router.get("/capture/area")
def get_capture_area():
    return get_area()

@router.post("/capture/area")
def set_capture_area(area: Area):
    path = os.path.join(DATA_DIR, "area.json")
    with open(path, "w") as f:
        json.dump(area.model_dump(), f)
    return {"success": True, "area": area.model_dump()}
```

### routes/capture.py
```python
from fastapi import APIRouter, Response
import mss
import os

from core.config import DATA_DIR
from routes.capture_area import get_area

router = APIRouter()

@router.get("/capture")
def capture():
    area = get_area()
    with mss.mss() as sct:
        monitor = {"left": area["x"], "top": area["y"], "width": area["w"], "height": area["h"]}
        img = sct.grab(monitor)
        png_data = mss.tools.to_png(img.rgb, img.size)

    with open(os.path.join(DATA_DIR, "capture.png"), "wb") as f:
        f.write(png_data)

    return Response(content=png_data, media_type="image/png")
```

### routes/capture_new_only.py
```python
from fastapi import APIRouter, Response
import mss
import hashlib
import os

from core.config import DATA_DIR
from routes.capture_area import get_area

router = APIRouter()

def get_image_hash(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()

@router.get("/capture/new-only")
def capture_new_only():
    area = get_area()
    with mss.mss() as sct:
        monitor = {"left": area["x"], "top": area["y"], "width": area["w"], "height": area["h"]}
        img = sct.grab(monitor)
        png_data = mss.tools.to_png(img.rgb, img.size)

    new_hash = get_image_hash(png_data)
    hash_path = os.path.join(DATA_DIR, "capture-hash.txt")

    old_hash = ""
    if os.path.exists(hash_path):
        with open(hash_path) as f:
            old_hash = f.read().strip()

    if new_hash == old_hash:
        return Response(status_code=204)

    with open(hash_path, "w") as f:
        f.write(new_hash)
    with open(os.path.join(DATA_DIR, "capture.png"), "wb") as f:
        f.write(png_data)

    return Response(content=png_data, media_type="image/png")
```

### routes/capture_full.py
```python
from fastapi import APIRouter, Response
import mss
import os

from core.config import DATA_DIR

router = APIRouter()

@router.get("/capture/full")
def capture_full():
    with mss.mss() as sct:
        img = sct.grab(sct.monitors[1])
        png_data = mss.tools.to_png(img.rgb, img.size)

    with open(os.path.join(DATA_DIR, "screen.png"), "wb") as f:
        f.write(png_data)

    return Response(content=png_data, media_type="image/png")
```

### routes/mouse_position.py
```python
from fastapi import APIRouter
import pyautogui

router = APIRouter()

@router.get("/mouse/position")
def mouse_position():
    pos = pyautogui.position()
    return {"x": pos.x, "y": pos.y}
```

### routes/mouse_move.py
```python
from fastapi import APIRouter
from pydantic import BaseModel
import pyautogui

router = APIRouter()

class Position(BaseModel):
    x: int
    y: int

@router.post("/mouse/move")
def mouse_move(pos: Position):
    pyautogui.moveTo(pos.x, pos.y)
    return {"success": True, "x": pos.x, "y": pos.y}
```

### routes/mouse_button.py
```python
from fastapi import APIRouter
import pyautogui
import threading

from core.state import mouse_down_timers

router = APIRouter()

def auto_release_button(button: str):
    pyautogui.mouseUp(button=button)
    mouse_down_timers.pop(button, None)

@router.post("/mouse/{button}/{action}")
def mouse_button(button: str, action: str):
    if action == "down":
        pyautogui.mouseDown(button=button)
        if button in mouse_down_timers:
            mouse_down_timers[button].cancel()
        timer = threading.Timer(10.0, auto_release_button, args=[button])
        timer.start()
        mouse_down_timers[button] = timer
    elif action == "up":
        pyautogui.mouseUp(button=button)
        if button in mouse_down_timers:
            mouse_down_timers[button].cancel()
            del mouse_down_timers[button]
    else:
        return {"success": False, "error": "Invalid action"}

    return {"success": True, "button": button, "action": action}
```

### routes/mouse_scroll.py
```python
from fastapi import APIRouter
from pydantic import BaseModel
import pyautogui

router = APIRouter()

class ScrollInput(BaseModel):
    x: int
    y: int

@router.post("/mouse/scroll")
def mouse_scroll(scroll: ScrollInput):
    pyautogui.scroll(scroll.y)
    if scroll.x != 0:
        pyautogui.hscroll(scroll.x)
    return {"success": True, "x": scroll.x, "y": scroll.y}
```

### routes/key_press.py
```python
from fastapi import APIRouter
import pyautogui

router = APIRouter()

@router.post("/key/{key}")
def key_press(key: str):
    pyautogui.press(key)
    return {"success": True, "key": key}
```

### routes/clipboard.py
```python
from fastapi import APIRouter
from pydantic import BaseModel
import pyperclip

router = APIRouter()

class ClipboardText(BaseModel):
    text: str

@router.get("/clipboard")
def get_clipboard():
    try:
        text = pyperclip.paste()
        return {"text": text}
    except Exception:
        return {"text": ""}

@router.post("/clipboard")
def set_clipboard(data: ClipboardText):
    pyperclip.copy(data.text)
    return {"success": True}
```

### routes/shutdown.py
```python
from fastapi import APIRouter
import pyautogui
import threading
import os

from core.state import mouse_down_timers

router = APIRouter()

@router.post("/shutdown")
def shutdown():
    for button, timer in list(mouse_down_timers.items()):
        timer.cancel()
        pyautogui.mouseUp(button=button)
    mouse_down_timers.clear()

    def stop():
        os._exit(0)

    threading.Timer(0.5, stop).start()
    return {"success": True, "message": "Server shutting down"}
```

### routes/__init__.py
```python
from . import (
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
```

## Dependencies

```
# requirements.txt
fastapi>=0.109.0
uvicorn>=0.27.0
pyautogui>=0.9.54
mss>=9.0.1
pyperclip>=1.8.2
```

## Scripts

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 6485 --reload
```

## CORS

Enable CORS for mobile web client access. Allowed all origins.

## Error Handling

All routes should handle exceptions and return appropriate HTTP status codes:
- 200: Success
- 204: No Content (for new-only when unchanged)
- 400: Bad Request (invalid parameters)
- 500: Server Error

## Key Implementation Notes

### Screen Capture
- Use `mss` for fast screen capture (faster than PIL/Pillow)
- mss returns raw RGB data, use `mss.tools.to_png()` to convert
- For `new-only`, compute MD5 hash of PNG bytes and compare with stored hash

### Mouse Down Safety
- On `/mouse/{button}/down`, start 10-second timer
- If timer fires, auto-call mouseUp
- On `/mouse/{button}/up`, cancel the timer if exists

### PyAutoGUI Settings
- Set `pyautogui.FAILSAFE = False` to disable corner failsafe
- This prevents interruption when cursor moves to screen corner
