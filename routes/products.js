const express = require('express');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const validateProduct = require('../middleware/validation');
const authenticate = require('../middleware/auth');

// In-memory products array (imported from server.js or kept here for modularity)
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

const router = express.Router();

// GET /api/products - List all products (with filtering, pagination)
router.get('/', (req, res) => {
  let { category, page = 1, limit = 10 } = req.query;
  let filtered = products;
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  // Pagination
  page = parseInt(page);
  limit = parseInt(limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);
  res.json({
    total: filtered.length,
    page,
    limit,
    products: paginated
  });
});

// GET /api/products/search?name=... - Search by name
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Name query required' });
  const results = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json({ results });
});

// GET /api/products/stats - Product statistics
router.get('/stats', (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json({ countByCategory: stats });
});

// GET /api/products/:id - Get a specific product
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

// POST /api/products - Create a new product
router.post('/', authenticate, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return next(new NotFoundError('Product not found'));
    const { name, description, price, category, inStock } = req.body;
    products[idx] = { ...products[idx], name, description, price, category, inStock };
    res.json(products[idx]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', authenticate, (req, res, next) => {
  try {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return next(new NotFoundError('Product not found'));
    const deleted = products.splice(idx, 1);
    res.json({ message: 'Product deleted', product: deleted[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 