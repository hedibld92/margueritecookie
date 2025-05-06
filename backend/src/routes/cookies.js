const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cookiesData = require('../data/cookies');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/cookies'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cookie-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées'));
  }
});

// Routes
router.get('/', async (req, res) => {
  try {
    res.json(cookiesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/cookies/${req.file.filename}` : null;

    // Ici, vous ajouteriez le cookie à votre base de données
    const newCookie = {
      id: Date.now(),
      name,
      description,
      price: parseFloat(price),
      image,
      category
    };

    res.status(201).json(newCookie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/cookies/${req.file.filename}` : undefined;

    // Ici, vous mettriez à jour le cookie dans votre base de données
    const updatedCookie = {
      id: parseInt(id),
      name,
      description,
      price: parseFloat(price),
      image: image || '/uploads/cookies/default.jpg',
      category
    };

    res.json(updatedCookie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Ici, vous supprimeriez le cookie de votre base de données
    res.json({ message: 'Cookie supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 