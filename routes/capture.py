from fastapi import APIRouter, Response, Header
from typing import Optional
import mss
import hashlib
import pyautogui
from PIL import Image
from io import BytesIO

router = APIRouter()


def get_image_hash(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


def parse_area(area: Optional[str]) -> dict:
    """Parse area string 'x,y,w,h' into dict. Returns full screen if None."""
    if area:
        parts = area.split(",")
        if len(parts) == 4:
            return {
                "left": int(parts[0]),
                "top": int(parts[1]),
                "width": int(parts[2]),
                "height": int(parts[3]),
            }
    # Default to full screen
    size = pyautogui.size()
    return {"left": 0, "top": 0, "width": size.width, "height": size.height}


def parse_resize(resize: Optional[str]) -> Optional[tuple]:
    """Parse resize string 'w,h' into tuple. Returns None if not provided."""
    if resize:
        parts = resize.split(",")
        if len(parts) == 2:
            return (int(parts[0]), int(parts[1]))
    return None


@router.get("/capture")
def capture(
    area: Optional[str] = None,
    quality: Optional[int] = None,
    resize: Optional[str] = None,
    last_hash: Optional[str] = Header(None, alias="Last-Hash")
):
    monitor = parse_area(area)

    with mss.mss() as sct:
        img = sct.grab(monitor)
        # Convert to PIL Image
        pil_img = Image.frombytes("RGB", img.size, img.bgra, "raw", "BGRX")

    # Resize if requested
    resize_dims = parse_resize(resize)
    if resize_dims:
        pil_img = pil_img.resize(resize_dims, Image.Resampling.LANCZOS)

    buffer = BytesIO()
    if quality is not None:
        # JPEG with specified quality
        pil_img.save(buffer, format="JPEG", quality=quality, optimize=True)
        media_type = "image/jpeg"
    else:
        # PNG (lossless)
        pil_img.save(buffer, format="PNG")
        media_type = "image/png"
    image_data = buffer.getvalue()

    new_hash = get_image_hash(image_data)

    # If client provided Last-Hash and it matches, return 204
    if last_hash and last_hash == new_hash:
        return Response(status_code=204, headers={"Next-Hash": new_hash})

    return Response(
        content=image_data,
        media_type=media_type,
        headers={"Next-Hash": new_hash}
    )
