import { Router } from 'express';
import { mouseButton } from './winInput';
import { state } from './state';

const router = Router();

const SAFETY_TIMEOUT_MS = 10000;

type ButtonName = 'left' | 'right' | 'middle';

function isValidButton(button: string): button is ButtonName {
  return button === 'left' || button === 'right' || button === 'middle';
}

async function releaseButton(buttonName: ButtonName): Promise<void> {
  const buttonState = state.mouseButtons[buttonName];
  if (buttonState.timer) {
    clearTimeout(buttonState.timer);
    buttonState.timer = null;
  }
  if (buttonState.isDown) {
    await mouseButton(buttonName, 'up');
    buttonState.isDown = false;
  }
}

router.post('/mouse/:button/:action', async (req, res) => {
  try {
    const { button, action } = req.params;

    if (!isValidButton(button)) {
      return res.status(400).json({ error: 'Invalid button. Use: left, right, or middle' });
    }

    if (action !== 'up' && action !== 'down') {
      return res.status(400).json({ error: 'Invalid action. Use: up or down' });
    }

    const buttonState = state.mouseButtons[button];

    if (action === 'down') {
      if (buttonState.timer) {
        clearTimeout(buttonState.timer);
      }

      await mouseButton(button, 'down');
      buttonState.isDown = true;

      buttonState.timer = setTimeout(async () => {
        console.log(`Safety timeout: releasing ${button} button`);
        await releaseButton(button);
      }, SAFETY_TIMEOUT_MS);

      res.json({ success: true, button, action: 'down' });
    } else {
      await releaseButton(button);
      res.json({ success: true, button, action: 'up' });
    }
  } catch (error) {
    console.error('Error handling mouse button:', error);
    res.status(500).json({ error: 'Failed to handle mouse button' });
  }
});

export { releaseButton };
export default router;
