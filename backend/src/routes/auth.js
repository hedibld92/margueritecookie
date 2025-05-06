const express = require('express');
const router = express.Router();

// Middleware d'authentification
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
};

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Pour le moment, utilisation d'identifiants en dur
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      req.session.user = {
        id: 1,
        username,
        role: 'admin'
      };
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: 'Identifiants invalides' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    res.json({ message: 'Déconnecté avec succès' });
  });
});

// Vérifier l'état de connexion
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Non authentifié' });
  }
});

module.exports = {
  router,
  requireAuth
}; 