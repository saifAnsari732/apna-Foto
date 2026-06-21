const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// Upload a new template
router.post('/', async (req, res) => {
  try {
    const { name, category, imageUrl, isPremium } = req.body;
    
    if (!name || !category || !imageUrl) {
      return res.status(400).json({ message: 'Name, category, and imageUrl are required.' });
    }

    const newTemplate = new Template({
      name,
      category,
      imageUrl,
      isPremium: isPremium || false,
    });

    await newTemplate.save();
    res.status(201).json({ message: 'Template uploaded successfully', template: newTemplate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch all templates (optionally filter by category)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
