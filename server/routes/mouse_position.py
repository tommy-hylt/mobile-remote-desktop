from fastapi import APIRouter
import pyautogui

router = APIRouter()


@router.get("/mouse/position")
def mouse_position():
    pos = pyautogui.position()
    return {"x": pos.x, "y": pos.y}
