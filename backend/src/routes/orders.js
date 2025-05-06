const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

// Simuler une base de données de commandes
let orders = [];

// Créer une nouvelle commande
router.post('/', async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;
    
    const newOrder = {
      id: Date.now(),
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date()
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir toutes les commandes (admin seulement)
router.get('/', requireAuth, async (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une commande spécifique
router.get('/:id', async (req, res) => {
  try {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le statut d'une commande (admin seulement)
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    order.status = status;
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 