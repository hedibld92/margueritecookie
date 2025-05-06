const express = require('express');
const router = express.Router();

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
    
    // Simulation de recherche du cookie (à remplacer par une vraie base de données)
    const cookie = {
      id: cookieId,
      name: 'Cookie Example',
      price: 2.50
    };

    const cartItem = req.session.cart.items.find(item => item.cookieId === cookieId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      req.session.cart.items.push({
        cookieId,
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