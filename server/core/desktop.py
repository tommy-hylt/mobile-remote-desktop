import logging
import sys
import os
import subprocess
import ctypes

logger = logging.getLogger("uvicorn")

def wake_console():
    """
    Forces the current session to attach to the physical console.
    This fixes the 'Black Screen' when RDP is disconnected.
    Requires Administrator privileges.
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
