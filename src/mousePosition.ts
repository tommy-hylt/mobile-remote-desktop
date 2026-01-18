import { Router } from 'express';
import { getMousePosition } from './winInput';

const router = Router();

router.get('/mouse/position', async (req, res) => {
  try {
    const pos = await getMousePosition();
    res.json(pos);
  } catch (error) {
    console.error('Error getting mouse position:', error);
    res.status(500).json({ error: 'Failed to get mouse position' });
  }
});

export default router;
