from fastapi import APIRouter
import sys
import ctypes
import pyautogui
from core.desktop import wake_console

router = APIRouter()


def wake_windows() -> None:
    """Attempt to wake display/session on Windows."""
    # 1. Force session to console if disconnected (Fix for Black Screen)
    wake_console()

    # 2. Ask Windows to keep the display/system awake.
    ES_CONTINUOUS = 0x80000000
    ES_SYSTEM_REQUIRED = 0x00000001
    ES_DISPLAY_REQUIRED = 0x00000002

    ctypes.windll.kernel32.SetThreadExecutionState(
        ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
    )

    # 3. Send a synthetic key press to dismiss screensaver/idle.
    VK_SHIFT = 0x10
    KEYEVENTF_KEYUP = 0x0002
    ctypes.windll.user32.keybd_event(VK_SHIFT, 0, 0, 0)
    ctypes.windll.user32.keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, 0)


@router.post("/wake")
def wake():
    """Best-effort wake: nudge input and request display on."""
    try:
        if sys.platform.startswith("win"):
            wake_windows()
        else:
            pyautogui.press("shift")
        return {"success": True}
    except Exception as exc:
        return {"success": False, "error": str(exc)}
