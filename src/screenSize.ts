import { Router } from 'express';
import { getScreenSize } from './winInput';

const router = Router();

router.get('/screen-size', async (req, res) => {
  try {
    const size = await getScreenSize();
    res.json(size);
  } catch (error) {
    console.error('Error getting screen size:', error);
    res.status(500).json({ error: 'Failed to get screen size' });
  }
});

export default router;
