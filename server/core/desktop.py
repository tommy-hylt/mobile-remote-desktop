import logging
import sys
import os
import subprocess
import ctypes

logger = logging.getLogger("uvicorn")

def ensure_desktop():
    """
    Ensures the current thread is attached to the active input desktop.
    """
    if not sys_platform_is_windows():
        return

    try:
        import win32service
        import win32con
        import win32api

        # 1. Ensure we are on the right Window Station (usually WinSta0)
        try:
            h_winsta = win32service.OpenWindowStation("WinSta0", False, win32con.MAXIMUM_ALLOWED)
            if h_winsta:
                h_winsta.SetProcessWindowStation()
        except Exception as e:
            logger.debug(f"Failed to set window station: {e}")

        # 2. Open the desktop that is currently receiving user input
        h_desk = win32service.OpenInputDesktop(0, False, win32con.MAXIMUM_ALLOWED)
        
        if not h_desk:
            # Try explicitly opening Winlogon if input desktop is blocked
            try:
                h_desk = win32service.OpenDesktop("Winlogon", 0, False, win32con.MAXIMUM_ALLOWED)
            except:
                pass

        if h_desk:
            h_current = win32service.GetThreadDesktop(win32api.GetCurrentThreadId())
            if h_desk.GetHandle() != h_current.GetHandle():
                try:
                    h_desk.SetThreadDesktop()
                    logger.info("Migrated thread to active desktop (UAC/Lock Screen support)")
                except Exception as e:
                    logger.error(f"Migration failed: {e}")
            h_desk.CloseDesktop()
            
    except Exception as e:
        logger.debug(f"ensure_desktop unexpected error: {e}")

def wake_console():
    """
    Forces the current session to attach to the physical console.
    """
    if not sys_platform_is_windows():
        return False

    try:
        kernel32 = ctypes.windll.kernel32
        current_session_id = ctypes.c_uint32()
        if not kernel32.ProcessIdToSessionId(kernel32.GetCurrentProcessId(), ctypes.byref(current_session_id)):
            return False
        
        sid = current_session_id.value
        logger.info(f"Attempting to wake console for session {sid}...")

        cmd = f"tscon.exe {sid} /dest:console"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            logger.info(f"Successfully executed tscon for session {sid}")
            return True
        else:
            logger.error(f"tscon failed: {result.stderr}")
            return False
            
    except Exception as e:
        logger.error(f"Error during wake_console: {e}")
        return False

def sys_platform_is_windows():
    return sys.platform == 'win32'
