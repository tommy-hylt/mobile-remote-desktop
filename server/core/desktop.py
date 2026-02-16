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
    if sys_platform_is_windows():
        try:
            # 1. Get the current session ID using query session
            # We look for the active session or the session associated with our process
            kernel32 = ctypes.windll.kernel32
            current_session_id = ctypes.c_uint32()
            if not kernel32.ProcessIdToSessionId(kernel32.GetCurrentProcessId(), ctypes.byref(current_session_id)):
                return False
            
            sid = current_session_id.value
            
            # 2. Use tscon to move this session to the console (ID 1 usually)
            # We try common console IDs: 1, 2, 0
            # On Hyper-V, console is often session 1
            for console_id in [1, 2, 0]:
                if sid == console_id: continue # Already on that console?
                
                cmd = f"tscon.exe {sid} /dest:console"
                # Executing via shell to handle potential permission elevation needs
                result = subprocess.run(cmd, shell=True, capture_output=True)
                if result.returncode == 0:
                    logger.info(f"Successfully moved session {sid} to console via ID {console_id}")
                    return True
            
            return False
        except Exception as e:
            logger.error(f"Failed to wake console: {e}")
            return False
    return False

def sys_platform_is_windows():
    return sys.platform == 'win32'
