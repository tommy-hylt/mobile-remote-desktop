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
