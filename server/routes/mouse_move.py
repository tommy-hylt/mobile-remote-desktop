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
