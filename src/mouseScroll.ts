import { Router } from 'express';
import { mouseScroll } from './winInput';

const router = Router();

router.post('/mouse/scroll', async (req, res) => {
  try {
    const { x, y } = req.body;

    if (typeof x !== 'number' || typeof y !== 'number') {
      return res.status(400).json({ error: 'Invalid parameters. Required: x, y (numbers)' });
    }

    await mouseScroll(x, y);
    res.json({ success: true, x, y });
  } catch (error) {
    console.error('Error scrolling:', error);
    res.status(500).json({ error: 'Failed to scroll' });
  }
});

export default router;
