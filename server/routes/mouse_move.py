from fastapi import APIRouter
from pydantic import BaseModel
import pyautogui
from core.desktop import ensure_desktop

router = APIRouter()


class Position(BaseModel):
    x: int
    y: int


@router.post("/mouse/move")
def mouse_move(pos: Position):
    ensure_desktop()
    pyautogui.moveTo(pos.x, pos.y)
    return {"success": True, "x": pos.x, "y": pos.y}
