import { Router } from 'express';
import { pressKey } from './winInput';

const router = Router();

router.post('/key/:key', async (req, res) => {
  try {
    const { key } = req.params;

    if (!key || key.length === 0) {
      return res.status(400).json({ error: 'Key parameter is required' });
    }

    await pressKey(key);
    res.json({ success: true, key });
  } catch (error) {
    console.error('Error pressing key:', error);
    res.status(500).json({ error: 'Failed to press key' });
  }
});

export default router;
