import express from 'express';
import { searchSongs, getStreamUrl, getMetadata } from '../services/youtubeService.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });
  const results = await searchSongs(q);
  res.json(results);
});

router.get('/trending', async (req, res) => {
  // Simple fallback for trending
  const results = await searchSongs('trending music 2024');
  res.json(results);
});

router.get('/stream/:id', async (req, res) => {
  try {
    const url = await getStreamUrl(req.params.id);
    res.redirect(url);
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract stream' });
  }
});

router.get('/metadata/:id', async (req, res) => {
  try {
    const metadata = await getMetadata(req.params.id);
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

export default router;
