from fastapi import APIRouter
import pyautogui

router = APIRouter()


@router.post("/text/{text:path}")
def type_text(text: str):
    pyautogui.write(text)
    return {"success": True, "text": text}
