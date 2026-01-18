from fastapi import APIRouter
import pyautogui
import threading
import os

from core.state import mouse_down_timers

router = APIRouter()


@router.post("/shutdown")
def shutdown():
    for button, timer in list(mouse_down_timers.items()):
        timer.cancel()
        pyautogui.mouseUp(button=button)
    mouse_down_timers.clear()

    def stop():
        os._exit(0)

    threading.Timer(0.5, stop).start()
    return {"success": True, "message": "Server shutting down"}
