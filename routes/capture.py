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
