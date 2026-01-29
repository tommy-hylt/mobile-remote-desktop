from fastapi import APIRouter
import pyautogui

router = APIRouter()


@router.get("/screen-size")
def screen_size():
    size = pyautogui.size()
    return {"width": size.width, "height": size.height}
