import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL = 'https://fakestoreapi.com';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const tokenStore = new Map();

function createToken(userId) {
  const token = nanoid(32);
  tokenStore.set(token, userId);
  return token;
}

function getUserById(userId) {
  return db.data.users.find(u => u.id === userId);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const userId = token ? tokenStore.get(token) : null;
  const user = userId ? getUserById(userId) : null;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = user;
  req.token = token;
  return next();
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const existing = db.data.users.find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ message: 'Username already taken.' });
  }

  const newUser = {
    id: nanoid(12),
    username,
    role: 'user',
    passwordHash: await bcrypt.hash(password, 10)
  };

  db.data.users.push(newUser);
  await db.write();

  res.status(201).json({
    user: { id: newUser.id, username: newUser.username, role: newUser.role }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = createToken(user.id);
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  tokenStore.delete(req.token);
  res.json({ success: true });
});

app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      return res.status(502).json({ message: 'Failed to fetch products.' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${req.params.id}`);
    if (!response.ok) {
      return res.status(502).json({ message: 'Failed to fetch product.' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      return res.status(502).json({ message: 'Failed to fetch categories.' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

app.get('/api/products/:id/reviews', (req, res) => {
  const productId = String(req.params.id);
  const reviews = db.data.reviews.filter(r => r.productId === productId);
  res.json(reviews);
});

app.post('/api/products/:id/reviews', requireAuth, async (req, res) => {
  const productId = String(req.params.id);
  const { rating, comment } = req.body || {};

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required.' });
  }

  const ratingNumber = Number(rating);
  if (ratingNumber < 1 || ratingNumber > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  const alreadyReviewed = db.data.reviews.some(
    r => r.productId === productId && r.userId === req.user.id
  );
  if (alreadyReviewed) {
    return res.status(409).json({ message: 'You already reviewed this product.' });
  }

  const review = {
    id: nanoid(12),
    productId,
    userId: req.user.id,
    username: req.user.username,
    rating: ratingNumber,
    comment,
    date: new Date().toISOString()
  };

  db.data.reviews.unshift(review);
  await db.write();

  res.status(201).json(review);
});

app.delete('/api/products/:id/reviews/:reviewId', requireAuth, async (req, res) => {
  const productId = String(req.params.id);
  const reviewId = String(req.params.reviewId);

  const review = db.data.reviews.find(r => r.id === reviewId && r.productId === productId);
  if (!review) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  const isOwner = review.userId === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  db.data.reviews = db.data.reviews.filter(r => r.id !== reviewId);
  await db.write();

  res.json({ success: true });
});

app.get('/api/orders', requireAuth, (req, res) => {
  const orders = req.user.role === 'admin'
    ? db.data.orders
    : db.data.orders.filter(o => o.userId === req.user.id);

  res.json(orders);
});

app.get('/api/orders/:id', requireAuth, (req, res) => {
  const order = db.data.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const isOwner = order.userId === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  res.json(order);
});

app.post('/api/orders', requireAuth, async (req, res) => {
  const { items, total } = req.body || {};

  if (!Array.isArray(items) || items.length === 0 || typeof total !== 'number') {
    return res.status(400).json({ message: 'Invalid order payload.' });
  }

  const order = {
    id: nanoid(12),
    userId: req.user.id,
    items,
    total,
    status: 'Completed',
    date: new Date().toISOString()
  };

  db.data.orders.unshift(order);
  await db.write();

  res.status(201).json(order);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
