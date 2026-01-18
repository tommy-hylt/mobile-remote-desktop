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
