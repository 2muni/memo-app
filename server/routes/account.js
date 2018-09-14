import express from 'express';
import Account from '../models/account';
import bkfd2Password from 'pbkdf2-password';

const hasher = bkfd2Password();

const router = express.Router();

router.post('/signup', (req, res) => {
  res.json({ success: true });
});

router.post('/signup', (req, res) => {
  res.json({ success: true });
});

router.get('/getinfo', (req, res) => {
  res.json({ info: null });
});

router.post('/logout', (req, res) => {
  return res.json({ success: true });
});

export default router;