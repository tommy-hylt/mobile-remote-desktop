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
    if sys_platform_is_windows():
        try:
            import win32service
            import win32con
            import win32api

            h_desk = win32service.OpenInputDesktop(0, False, win32con.MAXIMUM_ALLOWED)
            if h_desk:
                h_current = win32service.GetThreadDesktop(win32api.GetCurrentThreadId())
                if h_desk.GetHandle() != h_current.GetHandle():
                    logger.info("Switching thread desktop to active input desktop")
                    h_desk.SetThreadDesktop()
        except Exception:
            pass

def wake_console():
    """
    Forces the current session to attach to the physical console.
    This fixes the 'Black Screen' when RDP is disconnected.
    Requires Administrator privileges.
    """
    if not sys_platform_is_windows():
        return False

    try:
        # Get the current session ID associated with this process
        kernel32 = ctypes.windll.kernel32
        current_session_id = ctypes.c_uint32()
        if not kernel32.ProcessIdToSessionId(kernel32.GetCurrentProcessId(), ctypes.byref(current_session_id)):
            logger.error("Could not determine current session ID")
            return False
        
        sid = current_session_id.value
        logger.info(f"Attempting to wake console for session {sid}...")

        # Use tscon to move this session to the console.
        # /dest:console is the universal keyword for the physical/Hyper-V monitor.
        cmd = f"tscon.exe {sid} /dest:console"
        
        # We run this via subprocess
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            logger.info(f"Successfully executed tscon for session {sid}")
            return True
        else:
            logger.error(f"tscon failed with code {result.returncode}: {result.stderr}")
            # Try a common alternative for older Windows versions
            alt_cmd = f"tscon.exe %sessionname% /dest:console"
            subprocess.run(alt_cmd, shell=True)
            return False
            
    except Exception as e:
        logger.error(f"Error during wake_console: {e}")
        return False

def sys_platform_is_windows():
    return sys.platform == 'win32'
