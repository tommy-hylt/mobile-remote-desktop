import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = Router();

// Use PowerShell for clipboard operations on Windows
async function getClipboard(): Promise<string> {
  const { stdout } = await execAsync('powershell -command "Get-Clipboard"');
  return stdout.trim();
}

async function setClipboard(text: string): Promise<void> {
  // Escape single quotes and use PowerShell
  const escaped = text.replace(/'/g, "''");
  await execAsync(`powershell -command "Set-Clipboard -Value '${escaped}'"`);
}

router.get('/clipboard', async (req, res) => {
  try {
    const text = await getClipboard();
    res.json({ text });
  } catch (error) {
    console.error('Error getting clipboard:', error);
    res.status(500).json({ error: 'Failed to get clipboard content' });
  }
});

router.post('/clipboard', async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid parameter. Required: text (string)' });
    }

    await setClipboard(text);
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting clipboard:', error);
    res.status(500).json({ error: 'Failed to set clipboard content' });
  }
});

export default router;
