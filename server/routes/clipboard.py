from fastapi import APIRouter
from pydantic import BaseModel
import pyperclip

router = APIRouter()


class ClipboardText(BaseModel):
    text: str


@router.get("/clipboard")
def get_clipboard():
    try:
        text = pyperclip.paste()
        return {"text": text}
    except Exception:
        return {"text": ""}


@router.post("/clipboard")
def set_clipboard(data: ClipboardText):
    pyperclip.copy(data.text)
    return {"success": True}
