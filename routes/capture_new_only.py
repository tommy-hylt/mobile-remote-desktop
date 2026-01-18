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
