require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Configuration Redis
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

// Configuration CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://margueritecookie.fr' 
    : 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Configuration des sessions
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'votre_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
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
    cb('Error: Images only!');
  }
});

// Routes
app.get('/api/cookies', async (req, res) => {
  try {
    // Ici, vous ajouterez la logique pour récupérer les cookies de votre base de données
    const cookies = [
      { id: 1, name: 'Chocolat', price: 2.50, description: 'Cookie au chocolat noir' },
      { id: 2, name: 'Vanille', price: 2.50, description: 'Cookie à la vanille de Madagascar' }
    ];
    res.json(cookies);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de paiement Stripe
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur'
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
=================================
🍪 Marguerite Cookie API
=================================
🚀 Serveur démarré sur le port ${PORT}
🌍 Mode: ${process.env.NODE_ENV}
=================================
  `);
}); 