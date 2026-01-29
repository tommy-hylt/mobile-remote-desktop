from fastapi import APIRouter
from pydantic import BaseModel
import pyautogui

router = APIRouter()


class ScrollInput(BaseModel):
    x: int
    y: int


@router.post("/mouse/scroll")
def mouse_scroll(scroll: ScrollInput):
    pyautogui.scroll(scroll.y)
    if scroll.x != 0:
        pyautogui.hscroll(scroll.x)
    return {"success": True, "x": scroll.x, "y": scroll.y}
