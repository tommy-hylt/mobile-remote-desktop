import logging
import sys

logger = logging.getLogger("uvicorn")

def ensure_desktop():
    """
    Ensures the current thread is attached to the active input desktop (e.g. Default or Winlogon).
    This allows capturing and interacting with UAC prompts and the Lock Screen.
    
    Note: This only works on Windows and requires the server to be running 
    with high privileges (Administrator or SYSTEM).
    """
    if sys_platform_is_windows():
        try:
            import win32service
            import win32con
            import win32api

            # Open a handle to the desktop that is currently receiving user input
            h_desk = win32service.OpenInputDesktop(0, False, win32con.MAXIMUM_ALLOWED)
            if h_desk:
                # Get the desktop currently assigned to this thread
                h_current = win32service.GetThreadDesktop(win32api.GetCurrentThreadId())
                
                # If the input desktop is different from our thread's desktop, switch to it
                if h_desk.GetHandle() != h_current.GetHandle():
                    logger.info("Switching thread desktop to active input desktop (UAC/Lock Screen support)")
                    h_desk.SetThreadDesktop()
        except Exception:
            # Silently fail if we don't have permissions to switch desktops
            pass

def sys_platform_is_windows():
    return sys.platform == 'win32'
