import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// Create a temp PS1 file with the WinInput class
const psScript = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public class WinInput {
    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    public static extern bool GetCursorPos(out POINT lpPoint);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, int dx, int dy, int dwData, int dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern int GetSystemMetrics(int nIndex);

    public struct POINT {
        public int X;
        public int Y;
    }

    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP = 0x0004;
    public const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
    public const uint MOUSEEVENTF_RIGHTUP = 0x0010;
    public const uint MOUSEEVENTF_MIDDLEDOWN = 0x0020;
    public const uint MOUSEEVENTF_MIDDLEUP = 0x0040;
    public const uint MOUSEEVENTF_WHEEL = 0x0800;
    public const uint MOUSEEVENTF_HWHEEL = 0x01000;
}
'@
`;

const scriptPath = path.join(os.tmpdir(), 'winInput.ps1');

function ensureScript(): void {
  if (!fs.existsSync(scriptPath)) {
    fs.writeFileSync(scriptPath, psScript);
  }
}

async function runPs(command: string): Promise<string> {
  ensureScript();
  const fullCmd = `. "${scriptPath}"; ${command}`;
  const { stdout } = await execAsync(`powershell -ExecutionPolicy Bypass -Command "${fullCmd.replace(/"/g, '\\"')}"`);
  return stdout.trim();
}

export async function getScreenSize(): Promise<{ width: number; height: number }> {
  const result = await runPs('$w = [WinInput]::GetSystemMetrics(0); $h = [WinInput]::GetSystemMetrics(1); Write-Output "$w,$h"');
  const [width, height] = result.split(',').map(Number);
  return { width, height };
}

export async function getMousePosition(): Promise<{ x: number; y: number }> {
  const result = await runPs('$p = New-Object WinInput+POINT; [WinInput]::GetCursorPos([ref]$p) | Out-Null; Write-Output "$($p.X),$($p.Y)"');
  const [x, y] = result.split(',').map(Number);
  return { x, y };
}

export async function moveMouse(x: number, y: number): Promise<void> {
  await runPs(`[WinInput]::SetCursorPos(${x}, ${y})`);
}

export async function mouseButton(button: 'left' | 'right' | 'middle', action: 'down' | 'up'): Promise<void> {
  const flags: { [key: string]: { down: string; up: string } } = {
    left: { down: 'MOUSEEVENTF_LEFTDOWN', up: 'MOUSEEVENTF_LEFTUP' },
    right: { down: 'MOUSEEVENTF_RIGHTDOWN', up: 'MOUSEEVENTF_RIGHTUP' },
    middle: { down: 'MOUSEEVENTF_MIDDLEDOWN', up: 'MOUSEEVENTF_MIDDLEUP' },
  };
  const flag = flags[button][action];
  await runPs(`[WinInput]::mouse_event([WinInput]::${flag}, 0, 0, 0, 0)`);
}

export async function mouseScroll(x: number, y: number): Promise<void> {
  if (y !== 0) {
    await runPs(`[WinInput]::mouse_event([WinInput]::MOUSEEVENTF_WHEEL, 0, 0, ${y * -120}, 0)`);
  }
  if (x !== 0) {
    await runPs(`[WinInput]::mouse_event([WinInput]::MOUSEEVENTF_HWHEEL, 0, 0, ${x * 120}, 0)`);
  }
}

export async function pressKey(key: string): Promise<void> {
  const specialKeys: { [key: string]: string } = {
    enter: '{ENTER}', return: '{ENTER}',
    tab: '{TAB}', escape: '{ESC}', esc: '{ESC}',
    backspace: '{BACKSPACE}', delete: '{DELETE}',
    space: ' ', up: '{UP}', down: '{DOWN}',
    left: '{LEFT}', right: '{RIGHT}',
    home: '{HOME}', end: '{END}',
    pageup: '{PGUP}', pagedown: '{PGDN}',
    f1: '{F1}', f2: '{F2}', f3: '{F3}', f4: '{F4}',
    f5: '{F5}', f6: '{F6}', f7: '{F7}', f8: '{F8}',
    f9: '{F9}', f10: '{F10}', f11: '{F11}', f12: '{F12}',
  };

  const lowerKey = key.toLowerCase();
  let sendKey = specialKeys[lowerKey] || key;

  if (sendKey.length === 1 && '+-^%~(){}[]'.includes(sendKey)) {
    sendKey = `{${sendKey}}`;
  }

  const escaped = sendKey.replace(/'/g, "''");
  await execAsync(`powershell -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${escaped}')"`);
}
