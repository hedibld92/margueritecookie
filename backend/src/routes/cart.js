const express = require('express');
const router = express.Router();
const cookiesData = require('../data/cookies');

// Middleware pour vérifier si le panier existe dans la session
const initCart = (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      total: 0
    };
  }
  next();
};

// Routes
router.get('/', initCart, (req, res) => {
  res.json(req.session.cart);
});

router.post('/add', initCart, (req, res) => {
  try {
    const { cookieId, quantity = 1 } = req.body;
    
    // Recherche du cookie dans les données
    const cookie = cookiesData.find(c => c.id === parseInt(cookieId));
    
    if (!cookie) {
      return res.status(404).json({ error: 'Cookie non trouvé' });
    }

    const cartItem = req.session.cart.items.find(item => item.cookieId === parseInt(cookieId));

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      req.session.cart.items.push({
        cookieId: cookie.id,
        name: cookie.name,
        price: cookie.price,
        quantity
      });
    }

    // Recalculer le total
    req.session.cart.total = req.session.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:cookieId', initCart, (req, res) => {
  try {
    const { cookieId } = req.params;
    const { quantity } = req.body;

    const cartItem = req.session.cart.items.find(item => item.cookieId === parseInt(cookieId));

    if (!cartItem) {
      return res.status(404).json({ error: 'Article non trouvé dans le panier' });
    }

    if (quantity > 0) {
      cartItem.quantity = quantity;
    } else {
      req.session.cart.items = req.session.cart.items.filter(item => item.cookieId !== parseInt(cookieId));
    }

    // Recalculer le total
    req.session.cart.total = req.session.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/remove/:cookieId', initCart, (req, res) => {
  try {
    const { cookieId } = req.params;

    req.session.cart.items = req.session.cart.items.filter(
      item => item.cookieId !== parseInt(cookieId)
    );

    // Recalculer le total
    req.session.cart.total = req.session.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clear', initCart, (req, res) => {
  try {
    req.session.cart = {
      items: [],
      total: 0
    };
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 