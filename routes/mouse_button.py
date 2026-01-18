from fastapi import APIRouter
import pyautogui
import threading

from core.state import mouse_down_timers

router = APIRouter()


def auto_release_button(button: str):
    pyautogui.mouseUp(button=button)
    mouse_down_timers.pop(button, None)


@router.post("/mouse/{button}/{action}")
def mouse_button(button: str, action: str):
    if action == "down":
        pyautogui.mouseDown(button=button)
        if button in mouse_down_timers:
            mouse_down_timers[button].cancel()
        timer = threading.Timer(10.0, auto_release_button, args=[button])
        timer.start()
        mouse_down_timers[button] = timer
    elif action == "up":
        pyautogui.mouseUp(button=button)
        if button in mouse_down_timers:
            mouse_down_timers[button].cancel()
            del mouse_down_timers[button]
    else:
        return {"success": False, "error": "Invalid action"}

    return {"success": True, "button": button, "action": action}
