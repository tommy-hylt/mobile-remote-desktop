from fastapi import APIRouter, Response, Header
from typing import Optional
import mss
import hashlib
import pyautogui

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


@router.get("/capture")
def capture(
    area: Optional[str] = None,
    last_hash: Optional[str] = Header(None, alias="Last-Hash")
):
    monitor = parse_area(area)

    with mss.mss() as sct:
        img = sct.grab(monitor)
        png_data = mss.tools.to_png(img.rgb, img.size)

    new_hash = get_image_hash(png_data)

    # If client provided Last-Hash and it matches, return 204
    if last_hash and last_hash == new_hash:
        return Response(status_code=204, headers={"Next-Hash": new_hash})

    return Response(
        content=png_data,
        media_type="image/png",
        headers={"Next-Hash": new_hash}
    )
