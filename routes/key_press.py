from fastapi import APIRouter
import pyautogui

router = APIRouter()


@router.post("/key/{key}")
def key_press(key: str):
    pyautogui.press(key)
    return {"success": True, "key": key}
