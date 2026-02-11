from fastapi import APIRouter
import pyautogui
from core.desktop import ensure_desktop

router = APIRouter()


@router.post("/text/{text:path}")
def type_text(text: str):
    ensure_desktop()
    pyautogui.write(text)
    return {"success": True, "text": text}
