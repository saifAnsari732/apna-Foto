const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.get('/auth', (req, res) => {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return res.status(500).json({ error: 'ImageKit Private Key is not configured.' });
    }

    const token = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const expire = Math.floor(Date.now() / 1000) + 1800; // Expires in 30 minutes

    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    res.json({
      token,
      expire,
      signature
    });
  } catch (error) {
    console.error('ImageKit auth endpoint error:', error);
    res.status(500).json({ error: 'Failed to generate authentication parameters.' });
  }
});

module.exports = router;
