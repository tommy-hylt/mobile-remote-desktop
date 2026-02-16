from fastapi import APIRouter, Response, Header
from typing import Optional
import mss
import hashlib
import pyautogui
from PIL import Image
from io import BytesIO
from core.desktop import ensure_desktop
import logging
import threading
import queue

logger = logging.getLogger("uvicorn")
router = APIRouter()

def get_image_hash(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()

def parse_area(area: Optional[str]) -> dict:
    if area:
        parts = area.split(",")
        if len(parts) == 4:
            return {
                "left": int(parts[0]),
                "top": int(parts[1]),
                "width": int(parts[2]),
                "height": int(parts[3]),
            }
    size = pyautogui.size()
    return {"left": 0, "top": 0, "width": size.width, "height": size.height}

def parse_resize(resize: Optional[str]) -> Optional[tuple]:
    if resize:
        parts = resize.split(",")
        if len(parts) == 2:
            return (int(parts[0]), int(parts[1]))
    return None

def capture_worker(monitor, quality, result_queue):
    """Worker function to capture screen in a dedicated thread."""
    try:
        # Move THIS thread to the active desktop
        ensure_desktop()
        
        with mss.mss() as sct:
            img = sct.grab(monitor)
            # Check if the image is potentially all black
            if all(v == 0 for v in img.raw[:100]):
                 logger.warning("Captured image appears to be black/empty")
            
            # Convert to PIL Image
            pil_img = Image.frombytes("RGB", img.size, img.bgra, "raw", "BGRX")
            
            buffer = BytesIO()
            if quality is not None:
                pil_img.save(buffer, format="JPEG", quality=quality, optimize=True)
                media_type = "image/jpeg"
            else:
                pil_img.save(buffer, format="PNG")
                media_type = "image/png"
            
            result_queue.put((buffer.getvalue(), media_type, None))
    except Exception as e:
        logger.error(f"Capture worker failed: {e}")
        result_queue.put((None, None, str(e)))

@router.get("/capture")
def capture(
    area: Optional[str] = None,
    quality: Optional[int] = None,
    resize: Optional[str] = None,
    last_hash: Optional[str] = Header(None, alias="Last-Hash")
):
    monitor = parse_area(area)
    
    # Run capture in a dedicated thread to ensure SetThreadDesktop works
    result_queue = queue.Queue()
    thread = threading.Thread(target=capture_worker, args=(monitor, quality, result_queue))
    thread.start()
    thread.join(timeout=5.0)

    if not thread.is_alive():
        image_data, media_type, error = result_queue.get()
        if error or image_data is None:
            return Response(status_code=500, content=f"Capture error: {error}")
    else:
        logger.error("Capture thread timed out")
        return Response(status_code=504, content="Capture timeout")

    # Resizing is fast enough to do here
    resize_dims = parse_resize(resize)
    if resize_dims:
        pil_img = Image.open(BytesIO(image_data))
        pil_img = pil_img.resize(resize_dims, Image.Resampling.LANCZOS)
        buffer = BytesIO()
        pil_img.save(buffer, format="JPEG" if media_type == "image/jpeg" else "PNG")
        image_data = buffer.getvalue()

    new_hash = get_image_hash(image_data)

    if last_hash and last_hash == new_hash:
        return Response(status_code=204, headers={"Next-Hash": new_hash})

    return Response(
        content=image_data,
        media_type=media_type,
        headers={"Next-Hash": new_hash}
    )
